import { HashException } from './hash.exception';

describe('HashException', () => {
  it('should create an instance with the correct name and message', () => {
    const errorMessage = 'Failed to process hash';

    const exception = new HashException(errorMessage);

    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(HashException);
    expect(exception.name).toBe('HashException');
    expect(exception.message).toBe(errorMessage);
  });

  it('should be throwable', () => {
    const errorMessage = 'Something went wrong during the hash verification';
    const functionThatThrows = () => {
      throw new HashException(errorMessage);
    };

    expect(functionThatThrows).toThrow(HashException);
    expect(functionThatThrows).toThrow(errorMessage);
  });
});
