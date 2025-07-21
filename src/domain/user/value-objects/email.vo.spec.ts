import { EmailVO } from './email.vo';
import { ValueObjectException } from '@shared/exceptions/value-object.exception';

describe('EmailVO', () => {
  describe('Valid Emails', () => {
    it.each([
      ['test@example.com'],
      ['firstname.lastname@example.com'],
      ['email@subdomain.example.com'],
      ['firstname+lastname@example.com'],
      ['email@123.123.123.123'],
      ['"email"@example.com'],
      ['1234567890@example.com'],
      ['email@example-one.com'],
      ['_______@example.com'],
      ['email@example.name'],
      ['email@example.museum'],
      ['email@example.co.jp'],
      ['firstname-lastname@example.com'],
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
      ['Joe Smith <email@example.com>'],
      ['email.example.com'],
      ['email@example@example.com'],
      ['.email@example.com'],
      ['email.@example.com'],
      ['email..email@example.com'],
      ['email@example.com (Joe Smith)'],
      ['email@example'],
      ['email@-example.com'],
      ['email@111.222.333.44444'],
      ['email@example..com'],
    ])(
      'should throw ValueObjectException for an invalid email: %s',
      (invalidEmail) => {
        const createInvalidEmail = () => new EmailVO(invalidEmail);

        expect(createInvalidEmail).toThrow(ValueObjectException);
        expect(createInvalidEmail).toThrow('Invalid value to EmailVO');
      },
    );
  });
});
