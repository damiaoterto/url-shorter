import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { HashAlg } from './hash.alg';
import { HashException } from '../exceptions/hash.exception';

@Injectable()
export class Argon2Alg implements HashAlg {
  async hash(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      throw new HashException(error.message);
    }
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
