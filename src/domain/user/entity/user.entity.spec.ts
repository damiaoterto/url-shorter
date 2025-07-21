import { User } from './user.entity';
import { ValueObjectException } from '@shared/exceptions/value-object.exception';

describe('User Entity - Integration Test', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('when using valid data', () => {
    const validUserData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'a_secure_password_123',
    };

    it('should create a user instance correctly', () => {
      const user = User.create(validUserData);

      expect(user).toBeInstanceOf(User);
      expect(user.name).toBe(validUserData.name);
      expect(user.email).toBe(validUserData.email);
      expect(user.password).toBe(validUserData.password);
    });

    it('should assign a new Date to createdAt if not provided', () => {
      const fixedDate = new Date('2025-07-21T17:40:28.000Z');
      jest.useFakeTimers().setSystemTime(fixedDate);

      const user = User.create(validUserData);
      expect(user.createdAt).toEqual(fixedDate);
    });

    it('should use the provided createdAt date when available', () => {
      const specificDate = new Date('2024-01-01T00:00:00.000Z');
      const user = User.create({
        ...validUserData,
        createdAt: specificDate,
      });

      expect(user.createdAt).toEqual(specificDate);
    });
  });

  describe('when using invalid data', () => {
    it('should throw a ValueObjectException for an invalid email', () => {
      const invalidUserData = {
        name: 'Jane Doe',
        email: 'jane.doe-invalid-email',
        password: 'another_password_456',
      };

      const createUserWithInvalidEmail = () => User.create(invalidUserData);

      expect(createUserWithInvalidEmail).toThrow(ValueObjectException);
      expect(createUserWithInvalidEmail).toThrow('Invalid value to EmailVO');
    });
  });
});
