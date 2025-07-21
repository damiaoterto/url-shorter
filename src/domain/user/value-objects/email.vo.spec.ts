import { EmailVO } from './email.vo';
import { ValueObjectException } from '@shared/exceptions/value-object.exception';

describe('EmailVO', () => {
  describe('Valid Emails', () => {
    it.each([
      ['test@example.com'],
      ['firstname.lastname@example.com'],
      ['email@subdomain.example.com'],
      ['firstname+lastname@example.com'],
    ])('should create an EmailVO for a valid email: %s', (validEmail) => {
      const emailVO = new EmailVO(validEmail);

      expect(emailVO).toBeInstanceOf(EmailVO);
      expect(emailVO.value).toBe(validEmail);
    });
  });

  describe('Invalid Emails', () => {
    it.each([
      ['plainaddress'],
      ['#@%^%#$@#$@#.com'],
      ['@example.com'],
      ['email@example@example.com'],
      ['.email@example.com'],
      ['email.@example.com'],
      ['email..email@example.com'],
      ['email@example.com (Joe Smith)'],
    ])(
      'should throw ValueObjectException for an invalid email: %s',
      (invalidEmail) => {
        try {
          new EmailVO(invalidEmail);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error).toBeInstanceOf(ValueObjectException);
          expect(error.message).toBe('Invalid value to EmailVO');
        }
      },
    );
  });
});
