import { Test, TestingModule } from '@nestjs/testing';
import { CliHelperService } from './cli-helper.service';

describe('CliHelperService', () => {
  let service: CliHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CliHelperService],
    }).compile();

    service = module.get<CliHelperService>(CliHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
