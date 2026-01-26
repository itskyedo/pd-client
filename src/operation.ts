import {
  type HttpMethod,
  type OpenApiParameters,
  type OpenApiPath,
} from './types/openapi.ts';
import { type GenericApiRuntime } from './types/runtime.ts';

export type OperationParameters<
  TRuntime extends GenericApiRuntime,
  TPath extends keyof TRuntime['~paths'],
  TMethod extends HttpMethod,
> =
  NonNullable<TRuntime['~paths'][TPath]> extends infer Path extends OpenApiPath
    ? NonNullable<
        NonNullable<Path[Lowercase<TMethod>]>['parameters']
      > extends infer Params extends OpenApiParameters
      ? Required<Params>
      : never
    : never;

export function op<const TRuntime extends GenericApiRuntime>() {
  return {
    define<
      const TPath extends keyof TRuntime['~paths'],
      const TMethod extends HttpMethod,
    >(props: { path: TPath; method: TMethod }) {
      return props as {
        '~params': OperationParameters<TRuntime, TPath, TMethod>;
        path: TPath;
        method: TMethod;
      };
    },
  };
}
