import { Argon2Alg } from './argon2.alg';
import { HashException } from '../exceptions/hash.exception';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('Argon2Alg', () => {
  let argonAlg: Argon2Alg;

  beforeEach(() => {
    argonAlg = new Argon2Alg();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should return a hash on successful operation', async () => {
      const password = 'mySecretPassword';
      const expectedHash = 'a-long-and-secure-hash-string';

      (argon2.hash as jest.Mock).mockResolvedValue(expectedHash);

      const result = await argonAlg.hash(password);

      expect(result).toBe(expectedHash);

      expect(argon2.hash).toHaveBeenCalledWith(password);
      expect(argon2.hash).toHaveBeenCalledTimes(1);
    });

    it('should throw a HashException when argon2.hash fails', async () => {
      const password = 'mySecretPassword';
      const errorMessage = 'Internal argon2 error';

      (argon2.hash as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(argonAlg.hash(password)).rejects.toThrow(HashException);
      await expect(argonAlg.hash(password)).rejects.toThrow(errorMessage);
    });
  });

  describe('verify', () => {
    it('should return true when the password matches the hash', async () => {
      const password = 'mySecretPassword';
      const hash = 'a-long-and-secure-hash-string';

      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await argonAlg.verify(hash, password);

      expect(result).toBe(true);

      expect(argon2.verify).toHaveBeenCalledWith(hash, password);
      expect(argon2.verify).toHaveBeenCalledTimes(1);
    });

    it('should return false when the password does not match the hash', async () => {
      const password = 'wrongPassword';
      const hash = 'a-long-and-secure-hash-string';

      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await argonAlg.verify(hash, password);

      expect(result).toBe(false);
      expect(argon2.verify).toHaveBeenCalledWith(hash, password);
      expect(argon2.verify).toHaveBeenCalledTimes(1);
    });
  });
});
