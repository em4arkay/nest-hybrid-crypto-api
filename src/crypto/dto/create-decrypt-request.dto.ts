import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDecryptRequestDto {
    @ApiProperty({ description: 'RSA-encrypted AES key' })
    @IsString()
    @IsNotEmpty()
    data1: string;

    @ApiProperty({ description: 'AES-encrypted payload' })
    @IsString()
    @IsNotEmpty()
    data2: string;
}