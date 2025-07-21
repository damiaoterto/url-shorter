export class HashException extends Error {
  constructor(message: string) {
    super(message);
    this.name = HashException.name;
  }
}
