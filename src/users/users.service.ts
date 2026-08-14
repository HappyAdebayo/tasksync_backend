import { Injectable,UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto, LoginDto, RefreshTokenDto } from './dto/user.dto';
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
    const foundUser= await this.userModel.findOne({
      where:{
        email: body.email
      }
    })
    if(foundUser){
        throw new ConflictException('A user with this email already exists');
    }
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

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
        user: {
          name: user.name,
          email: user.email,
        },
    };
  }

  async refresh(body: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        body.refreshToken,
      );

      const user = await this.userModel.findByPk(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });

      const refreshToken = await this.jwtService.signAsync(newPayload, {
          expiresIn: '7d',
        });

      return {
        access_token:  accessToken,
        refresh_token: refreshToken,
      };

      } catch {
        throw new UnauthorizedException(
          'Invalid or expired refresh token',
        );
      }
  }
}