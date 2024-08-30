export class BadRequest {
  public readonly body: Error;
  constructor(error: Error) {
    this.body = error;
    this.response;
  }

  get response() {
    const statusCode = 400;
    return {
      statusCode,
      body: this.body,
    };
  }
}
