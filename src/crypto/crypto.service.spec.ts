// src/crypto/crypto.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { ConfigService } from '@nestjs/config';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'PRIVATE_KEY') {
                return 'mock-private-key-string';
              }
              if (key === 'PUBLIC_KEY') {
                return 'mock-public-key-string';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);

    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
