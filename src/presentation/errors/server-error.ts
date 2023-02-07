export class ServerError extends Error {
  data: unknown;
  constructor(error: unknown) {
    super("Internal server error");
    this.name = "ServerError";
    this.data = error;
  }
}
