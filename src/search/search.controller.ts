import { Controller, UseGuards, Request, Query, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  search(@Query('q') query: string, @Request() req) {
    return this.searchService.search(query, req.user?.id);
  }
}