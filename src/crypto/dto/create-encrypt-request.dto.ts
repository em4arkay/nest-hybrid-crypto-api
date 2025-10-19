import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEncryptRequestDto {
    @ApiProperty({ description: 'Payload to encrypt', maxLength: 2000 })
    @IsString()
    @MaxLength(2000)
    payload: string;
}