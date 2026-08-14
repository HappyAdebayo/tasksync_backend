import { Body, Controller, Post, Get, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('workspaces')
export class WorkspacesController {
     constructor(private readonly workspacesService: WorkspacesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body:CreateWorkspaceDto, @Req() req:Request){
        return this.workspacesService.create(body, req);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    index(@Req() req:Request){
       return this.workspacesService.index(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findAll(@Param('id') id:string){
        return this.workspacesService.findAllWorkspaceBoards(id)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    Delete(@Param('id') id:string, @Req() req:Request){
        return this.workspacesService.delete(id, req)
    }
    
}
