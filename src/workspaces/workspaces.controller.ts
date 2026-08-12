import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
     constructor(private readonly workspacesService: WorkspacesService) {}

    @Post()
    create(@Body() body:CreateWorkspaceDto){
        return this.workspacesService.create(body);
    }

    @Get()
    index(){
       return this.workspacesService.index();
    }
}
