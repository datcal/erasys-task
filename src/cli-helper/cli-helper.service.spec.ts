import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CliHelperService } from './cli-helper.service';
import { Password } from '../entities/password.entity';

describe('CliHelperService', () => {
  let service: CliHelperService;

  const mockCliHelperRepository = {
    getPasswords: jest.fn(async () =>
      Promise.resolve([
        {
          password: 'password1',
          valid: 1,
        },
        {
          password: 'password2',
          valid: 1,
        },
      ]),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CliHelperService,
        ConfigService,
        {
          provide: getRepositoryToken(Password),
          useValue: mockCliHelperRepository,
        },
      ],
    }).compile();

    service = module.get<CliHelperService>(CliHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be bla bla', () => {
    expect(service.getPasswords());
  });
});
