import { validate } from 'class-validator';
import { Match } from './match.decorator';

class TestPasswordDto {
  password?: string;

  @Match('password', { message: 'Passwords must match!' })
  passwordConfirm?: string;
}

describe('Match Decorator', () => {
  it('should pass validation if the properties are equal', async () => {
    const dto = new TestPasswordDto();
    dto.password = 'strongPassword123';
    dto.passwordConfirm = 'strongPassword123';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if the properties are different', async () => {
    const dto = new TestPasswordDto();
    dto.password = 'strongPassword123';
    dto.passwordConfirm = 'anotherPassword456';

    const errors = await validate(dto);

    expect(errors.length).toBe(1);

    expect(errors[0].property).toBe('passwordConfirm');

    expect(errors[0].constraints?.Match).toBe('Passwords must match!');
  });

  it('should use the default error message if none is provided', async () => {
    class TestDtoWithDefaultMessage {
      @Match('fieldToMatch')
      field: string;
      fieldToMatch: string;
    }

    const dto = new TestDtoWithDefaultMessage();
    dto.field = 'valueA';
    dto.fieldToMatch = 'valueB';

    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.Match).toBe('field must match fieldToMatch');
  });

  it('should fail if one of the properties is null or undefined', async () => {
    const dto = new TestPasswordDto();
    dto.password = 'strongPassword123';
    dto.passwordConfirm = undefined;

    const errors = await validate(dto);

    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('passwordConfirm');
  });
});
