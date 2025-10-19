import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService implements OnModuleInit {
    private privateKey: string;
    private publicKey: string;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.privateKey = this.configService.get<string>('PRIVATE_KEY');
        this.publicKey = this.configService.get<string>('PUBLIC_KEY');

        if (!this.privateKey || !this.publicKey) {
            throw new Error('PUBLIC_KEY or PRIVATE_KEY not found in .env file');
        }
    }

    encrypt(payload: string) {
        const aesKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
        let encryptedPayload = cipher.update(payload, 'utf8', 'base64');
        encryptedPayload += cipher.final('base64');
        const authTag = cipher.getAuthTag().toString('base64');
        const data2 = `${iv.toString('base64')}:${authTag}:${encryptedPayload}`;

        const data1 = crypto
            .privateEncrypt(
                {
                    key: this.privateKey,
                    // --- FIX IS HERE ---
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                aesKey,
            )
            .toString('base64');

        return { data1, data2 };
    }

    decrypt(data1: string, data2: string) {
        const aesKeyBuffer = crypto.publicDecrypt(
            {
                key: this.publicKey,
                // --- FIX IS HERE ---
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(data1, 'base64'),
        );

        const parts = data2.split(':');
        const iv = Buffer.from(parts[0], 'base64');
        const authTag = Buffer.from(parts[1], 'base64');
        const encryptedPayload = parts[2];

        const decipher = crypto.createDecipheriv('aes-256-gcm', aesKeyBuffer, iv);
        decipher.setAuthTag(authTag);

        let payload = decipher.update(encryptedPayload, 'base64', 'utf8');
        payload += decipher.final('utf8');

        return { payload };
    }
}
