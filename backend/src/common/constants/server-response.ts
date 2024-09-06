export class ServerResponse<T> {
  readonly message: string;
  private readonly statusCode: number;
  private readonly data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  public get response(): { statusCode: number; message: string; data?: T } {
    const resp = {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
    if (resp.data === undefined) delete resp.data;
    return resp;
  }
}
