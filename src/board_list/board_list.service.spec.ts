import { Test, TestingModule } from '@nestjs/testing';
import { BoardListService } from './board_list.service';

describe('BoardListService', () => {
  let service: BoardListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardListService],
    }).compile();

    service = module.get<BoardListService>(BoardListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
