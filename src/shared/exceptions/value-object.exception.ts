export class ValueObjectException extends Error {
  constructor(voName: string) {
    super(`Invalid value to ${voName}`);
    this.name = ValueObjectException.name;
  }
}
