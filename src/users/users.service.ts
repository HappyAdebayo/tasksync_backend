import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto,LoginDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
   constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
     private readonly jwtService: JwtService,
  ) {}

  async create(body: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    const userData = user.toJSON();
    delete userData.password;

    return userData;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  }

   async login(body: LoginDto) {
    const user = await this.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
        user: {
          name: user.name,
          email: user.email,
        },
    };
  }
}
