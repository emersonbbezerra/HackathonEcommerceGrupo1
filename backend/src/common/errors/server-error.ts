class ServerError extends Error {
  constructor(message?: string) {
    super(message ? message : "Internal server error");
    this.name = "ServerError";
    this.message;
  }
}

export { ServerError };
