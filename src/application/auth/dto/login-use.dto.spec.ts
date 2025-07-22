import { LoginUserDTO } from './login-user.dto';

describe('LoginUserDTO', () => {
  it('should be able to create an instance and assign properties', () => {
    const dtoData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const dto = new LoginUserDTO();
    dto.email = dtoData.email;
    dto.password = dtoData.password;

    expect(dto).toBeInstanceOf(LoginUserDTO);
    expect(dto.email).toBe(dtoData.email);
    expect(dto.password).toBe(dtoData.password);
  });
});
