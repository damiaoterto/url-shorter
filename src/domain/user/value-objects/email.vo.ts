import { ValueObjectException } from '@shared/exceptions/value-object.exception';

export class EmailVO {
  public readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  public validate(value: string): void {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(value)) {
      throw new ValueObjectException(EmailVO.name);
    }
  }
}
