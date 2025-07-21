import { ValueObjectException } from './value-object.exception';

describe('ValueObjectException', () => {
  it('should create an instance of Error', () => {
    const error = new ValueObjectException('TestVO');
    expect(error).toBeInstanceOf(Error);
  });

  it('should create an instance of ValueObjectException', () => {
    const error = new ValueObjectException('TestVO');
    expect(error).toBeInstanceOf(ValueObjectException);
  });

  it('should have the correct name property', () => {
    const error = new ValueObjectException('TestVO');
    expect(error.name).toBe('ValueObjectException');
  });

  it('should construct the message correctly', () => {
    const voName = 'Email';
    const error = new ValueObjectException(voName);
    expect(error.message).toBe(`Invalid value to ${voName}`);
  });

  it('should be throwable', () => {
    const voName = 'Password';
    const functionThatThrows = () => {
      throw new ValueObjectException(voName);
    };

    expect(functionThatThrows).toThrow(`Invalid value to ${voName}`);

    expect(functionThatThrows).toThrow(ValueObjectException);
  });
});
