import { JwtToken } from './jwt-token.entity';

describe('JwtToken Entity', () => {
  describe('create', () => {
    it('should create a new JwtToken instance from a data object', () => {
      const data = {
        accessToken: 'token',
      };

      const jwtToken = JwtToken.create(data);

      expect(jwtToken).toBeInstanceOf(JwtToken);
      expect(jwtToken.accessToken).toBe(data.accessToken);
    });
  });
});
