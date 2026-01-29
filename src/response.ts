import { type FetchResponse } from 'openapi-fetch';
import { type MediaType, type OpenApiOperation } from './types/openapi.ts';

export type ApiResponse<
  TOperation extends OpenApiOperation,
  TTransforms extends ResponseTransforms<TOperation>,
> = Promise<
  {
    [TStatusCode in keyof TOperation['responses']]: TStatusCode extends number
      ? `${TStatusCode}` extends `2${number}${number}`
        ? SuccessResponse<
            TStatusCode,
            TransformedResponse<TStatusCode, TOperation, TTransforms>
          >
        : ErrorResponse<
            TStatusCode,
            NonNullable<
              TransformedResponse<TStatusCode, TOperation, TTransforms>
            >
          >
      : never;
  }[keyof TOperation['responses']]
>;

export interface SuccessResponse<TStatus extends number, TData> {
  readonly status: TStatus;
  readonly data: TData;
  readonly error?: never;
  readonly response: Response;
}

export interface ErrorResponse<
  TStatus extends number,
  TError extends Record<any, any>,
> {
  readonly status: TStatus;
  readonly data?: never;
  readonly error: TError;
  readonly response: Response;
}

export type TransformedResponse<
  TStatusCode extends keyof TOperation['responses'],
  TOperation extends OpenApiOperation,
  TTransforms extends ResponseTransforms<TOperation>,
> = TTransforms[TStatusCode] extends ResponseTransformFunction
  ? ReturnType<TTransforms[TStatusCode]>
  : ResponseJsonContent<TOperation, TStatusCode>;

export type ResponseTransforms<TOperation extends OpenApiOperation> = {
  [TStatusCode in keyof TOperation['responses']]?: ResponseTransformFunction<
    ResponseJsonContent<TOperation, TStatusCode>,
    Record<any, any>
  >;
};

export type ResponseJsonContent<
  TOperation extends OpenApiOperation,
  TStatusCode extends keyof TOperation['responses'],
> = TStatusCode extends number
  ? NonNullable<
      TOperation['responses'][TStatusCode]['content']
    >['application/json']
  : never;

type ResponseTransformFunction<
  TValue = any,
  TReturn extends Record<any, any> = Record<any, any>,
> = (value: TValue, response: Response) => TReturn;

export async function handleApiResponse<
  const TOperation extends OpenApiOperation,
  const TOptions,
  const TMedia extends MediaType,
  const TTransforms extends ResponseTransforms<TOperation>,
>(
  fetcher: Promise<FetchResponse<TOperation, TOptions, TMedia>>,
  transforms?: TTransforms,
): ApiResponse<TOperation, TTransforms> {
  const { data, error, response } = await fetcher;

  const transform: ResponseTransformFunction | undefined =
    transforms?.[response.status];

  if (response.ok) {
    return {
      success: true,
      status: response.status,
      data: typeof transform === 'function' ? transform(data, response) : data,
      response,
    } satisfies SuccessResponse<number, unknown> as Awaited<
      ApiResponse<TOperation, TTransforms>
    >;
  } else {
    const rawError = error ?? {};
    return {
      success: false,
      status: response.status,
      error:
        typeof transform === 'function'
          ? (transform(rawError, response) ?? {})
          : rawError,
      response,
    } satisfies ErrorResponse<number, unknown> as Awaited<
      ApiResponse<TOperation, TTransforms>
    >;
  }
}
