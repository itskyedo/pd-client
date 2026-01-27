export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'TRACE';

export type MediaType = `${string}/${string}`;

export interface OpenApiParameters {
  query?: Record<string, any>;
  header?: Record<string, any>;
  path?: Record<string, any>;
  cookie?: Record<string, any>;
}

export interface OpenApiRequestBody {
  content: {
    'application/json'?: Record<string, any>;
  };
}

export interface OpenApiOperation {
  parameters?: OpenApiParameters;
  requestBody?: OpenApiRequestBody;
  responses: OpenApiResponses;
}

export type OpenApiResponses = Record<
  number,
  {
    headers?: Record<string, any>;
    content?: Record<string, any>;
  }
>;

export interface OpenApiPath {
  parameters: OpenApiParameters;
  get?: OpenApiOperation;
  put?: OpenApiOperation;
  post?: OpenApiOperation;
  delete?: OpenApiOperation;
  patch?: OpenApiOperation;
  options?: OpenApiOperation;
  head?: OpenApiOperation;
  trace?: OpenApiOperation;
}

export type OpenApiPaths = object;

export interface OpenApiComponents {
  schemas: Record<string, any>;
}
