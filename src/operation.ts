import {
  type HttpMethod,
  type OpenApiOperation,
  type OpenApiPath,
} from './types/openapi.ts';
import { type GenericApiRuntime } from './types/runtime.ts';

export type OperationTypes<
  TRuntime extends GenericApiRuntime,
  TMethod extends HttpMethod,
  TPath extends keyof TRuntime['~paths'],
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
      const TMethod extends HttpMethod,
      const TPath extends keyof TRuntime['~paths'],
    >(props: { method: TMethod; path: TPath }) {
      return props as {
        '~types': OperationTypes<TRuntime, TMethod, TPath>;

        method: TMethod;
        path: TPath;
      };
    },
  };
}
