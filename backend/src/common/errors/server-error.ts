class ServerError extends Error {
  constructor() {
    super("Internal server error");
  }
}

export { ServerError };
