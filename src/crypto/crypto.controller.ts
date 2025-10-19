// src/crypto/crypto.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CreateEncryptRequestDto } from './dto/create-encrypt-request.dto';
import { CreateDecryptRequestDto } from './dto/create-decrypt-request.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ApiResponse<T> {
    successful: boolean;
    error_code: string;
    data: T;
}

const createApiResponse = <T>(data: T): ApiResponse<T> => ({
    successful: true,
    error_code: '',
    data: data,
});

@ApiTags('Encryption API')
@Controller()
export class CryptoController {
    constructor(private readonly cryptoService: CryptoService) { }

    @Post('get-encrypt-data')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Encrypts a payload' })
    @ApiResponse({ status: 200, description: 'Encryption successful.' })
    encryptData(@Body() body: CreateEncryptRequestDto) {
        const data = this.cryptoService.encrypt(body.payload);
        return createApiResponse(data);
    }

    @Post('get-decrypt-data')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Decrypts data' })
    @ApiResponse({ status: 200, description: 'Decryption successful.' })
    decryptData(@Body() body: CreateDecryptRequestDto) {
        const data = this.cryptoService.decrypt(body.data1, body.data2);
        return createApiResponse(data);
    }
}