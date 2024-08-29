class ServerResponse<T> {
  readonly message: string;
  private readonly statusCode: number;
  private readonly respData?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.respData = data;
  }

  public get data(): { statusCode: number; message: string; data?: T } {
    const resp = {
      statusCode: this.statusCode,
      message: this.message,
      data: this.respData,
    };
    if (!resp?.data) delete resp.data;
    return resp;
  }
}
