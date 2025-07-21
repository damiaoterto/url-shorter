import { RegisterUserDTO } from './register-user.dto';

describe('RegisterUserDTO', () => {
  it('should be able to create an instance and assign properties', () => {
    const dtoData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    const dto = new RegisterUserDTO();
    dto.name = dtoData.name;
    dto.email = dtoData.email;
    dto.password = dtoData.password;
    dto.passwordConfirm = dtoData.passwordConfirm;

    expect(dto).toBeInstanceOf(RegisterUserDTO);
    expect(dto.name).toBe(dtoData.name);
    expect(dto.email).toBe(dtoData.email);
    expect(dto.password).toBe(dtoData.password);
    expect(dto.passwordConfirm).toBe(dtoData.passwordConfirm);
  });
});
