export interface Endpoint {
  path: string;
  method: string;
  description: string;
  authentication: string;
  contentType?: string;
  requiredFields?: string[];
  optionalFields?: { [key: string]: string } | null;
  requestExample: unknown;
  responseExample: unknown;
}

export interface ApiGroup {
  title: string;
  endpoints: Endpoint[];
}
