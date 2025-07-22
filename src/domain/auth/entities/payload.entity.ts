export class Payload {
  sub: string;
  email: string;

  static create(data: Payload): Payload {
    const payload = new Payload();

    payload.sub = data.sub;
    payload.email = data.email;

    return payload;
  }
}
