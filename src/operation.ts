import {
  type HttpMethod,
  type OpenApiOperation,
  type OpenApiPath,
} from './types/openapi.ts';
import { type GenericApiRuntime } from './types/runtime.ts';

export type OperationTypes<
  TRuntime extends GenericApiRuntime,
  TPath extends keyof TRuntime['~paths'],
  TMethod extends HttpMethod,
> =
  NonNullable<TRuntime['~paths'][TPath]> extends infer Path extends OpenApiPath
    ? Required<
        NonNullable<NonNullable<Path[Lowercase<TMethod>]>>
      > extends infer Operation extends Required<OpenApiOperation>
      ? Required<Operation['parameters']> & {
          body: NonNullable<
            Operation['requestBody']['content']['application/json']
          >;
        }
      : never
    : never;

export function op<const TRuntime extends GenericApiRuntime>() {
  return {
    define<
      const TPath extends keyof TRuntime['~paths'],
      const TMethod extends HttpMethod,
    >(props: { path: TPath; method: TMethod }) {
      return props as {
        '~types': OperationTypes<TRuntime, TPath, TMethod>;
        path: TPath;
        method: TMethod;
      };
    },
  };
}
