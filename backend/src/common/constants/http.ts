import { ServerResponse } from "./server-response";

export interface HttpResponse extends ServerResponse<typeof ServerResponse> {}

export interface HttpRequest {
  params?: string;
  query?: string;
  body?: any;
}
