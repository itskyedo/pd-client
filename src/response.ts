import { type FetchResponse } from 'openapi-fetch';
import { type IsOptional } from './types/helpers.ts';
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
            TransformedResponse<TStatusCode, TOperation, TTransforms>
          >
      : never;
  }[keyof TOperation['responses']]
>;

export interface SuccessResponse<TStatus extends number, TData> {
  readonly success: true;
  readonly status: TStatus;
  readonly data: TData;
  readonly error?: never;
  readonly response: Response;
}

export interface ErrorResponse<TStatus extends number, TError> {
  readonly success: false;
  readonly status: TStatus;
  readonly data?: never;
  readonly error: TError;
  readonly response: Response;
}

export type TransformedResponse<
  TStatusCode extends keyof TOperation['responses'],
  TOperation extends OpenApiOperation,
  TTransforms extends ResponseTransforms<TOperation>,
> = TStatusCode extends number
  ? IsOptional<TTransforms, TStatusCode> extends false
    ? TTransforms[TStatusCode] extends ResponseTransformFunction
      ? ReturnType<TTransforms[TStatusCode]>
      : ResponseJsonContent<TOperation, TStatusCode>
    : ResponseJsonContent<TOperation, TStatusCode>
  : never;

export type ResponseTransforms<TOperation extends OpenApiOperation> = {
  [TStatusCode in keyof TOperation['responses']]?: TStatusCode extends number
    ? (value: ResponseJsonContent<TOperation, TStatusCode>) => unknown
    : never;
};

export type ResponseJsonContent<
  TOperation extends OpenApiOperation,
  TStatusCode extends number,
> = NonNullable<
  TOperation['responses'][TStatusCode]['content']
>['application/json'];

type ResponseTransformFunction = (value: any) => unknown;

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
      data: typeof transform === 'function' ? transform(data) : data,
      response,
    } satisfies SuccessResponse<number, unknown> as Awaited<
      ApiResponse<TOperation, TTransforms>
    >;
  } else {
    return {
      success: false,
      status: response.status,
      error: typeof transform === 'function' ? transform(error) : error,
      response,
    } satisfies ErrorResponse<number, unknown> as Awaited<
      ApiResponse<TOperation, TTransforms>
    >;
  }
}
