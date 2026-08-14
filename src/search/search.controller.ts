import { Controller, UseGuards, Req, Query, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}