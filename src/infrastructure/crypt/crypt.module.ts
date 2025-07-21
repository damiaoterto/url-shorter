import { DynamicModule } from '@nestjs/common';
import { HashAlg } from './algs/hash.alg';

export class CryptModule {
  static forFeature(alg: new () => HashAlg): DynamicModule {
    return {
      module: CryptModule,
      providers: [{ provide: HashAlg, useClass: alg }],
    };
  }
}
