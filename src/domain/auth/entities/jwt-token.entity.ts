export class JwtToken {
  accessToken: string;

  static create(data: JwtToken): JwtToken {
    const jwtToken = new JwtToken();

    jwtToken.accessToken = data.accessToken;

    return jwtToken;
  }
}
