import { Test, TestingModule } from '@nestjs/testing';
import { BoardListController } from './board_list.controller';

describe('BoardListController', () => {
  let controller: BoardListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardListController],
    }).compile();

    controller = module.get<BoardListController>(BoardListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
