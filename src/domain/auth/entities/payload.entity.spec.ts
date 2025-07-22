import { Payload } from './payload.entity';

describe('Payload Entity', () => {
  describe('create', () => {
    it('should create a new Payload instance from a data object', () => {
      const data = {
        sub: 'user-id-12345',
        email: 'test.user@example.com',
      };

      const payload = Payload.create(data);

      expect(payload).toBeInstanceOf(Payload);
      expect(payload.sub).toBe(data.sub);
      expect(payload.email).toBe(data.email);
    });
  });
});
