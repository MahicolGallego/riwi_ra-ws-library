import { Test, TestingModule } from '@nestjs/testing';
import { LibraryController } from './books.controller';
import { LibraryService } from './books.service';

describe('LibraryController', () => {
  let controller: LibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [LibraryService],
    }).compile();

    controller = module.get<LibraryController>(LibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
