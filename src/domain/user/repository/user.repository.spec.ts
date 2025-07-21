import { InMemoryUserRepository } from './in-memory.repository';
import { UserRepository } from './user.repository';
import { User } from '../entity/user.entity';

describe('InMemoryUserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createNew', () => {
    it('should save a user in memory', async () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

      await repository.createNew(user);

      const foundUser = await repository.findByEmail('john.doe@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should return the user if found', async () => {
      const user = User.create({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password456',
      });
      await repository.createNew(user);

      const foundUser = await repository.findByEmail('jane.doe@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.name).toBe('Jane Doe');
      expect(foundUser).toEqual(user);
    });

    it('should return undefined if the user is not found', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com');

      expect(foundUser).toBeUndefined();
    });
  });
});
