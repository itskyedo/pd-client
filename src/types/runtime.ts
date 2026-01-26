import { type CoreRuntime } from '../core/core.ts';
import { type EventsRuntime } from '../events/events.ts';
import { type Fetcher } from '../fetcher.ts';
import { type OpenApiComponents, type OpenApiPaths } from './openapi.ts';

export interface ApiRuntime<
  TPaths extends OpenApiPaths,
  TComponents extends OpenApiComponents,
  TOptions extends BaseApiRuntimeOptions<number>,
  TFetcher extends Fetcher,
  TMethods extends GenericMethods,
> {
  '~paths': TPaths;
  '~components': TComponents;

  options: TOptions;
  fetcher: TFetcher;
  methods: TMethods;
}

export type GenericApiRuntime = ApiRuntime<
  OpenApiPaths,
  OpenApiComponents,
  BaseApiRuntimeOptions<number>,
  Fetcher,
  Record<string, any>
>;

export interface BaseApiRuntimeOptions<TVersion extends number> {
  version?: TVersion;
}

export type RuntimeSchema<
  TRuntime extends GenericApiRuntime = GenericApiRuntime,
> = Pick<TRuntime, 'fetcher' | 'methods'>;

export type GenericMethods = Record<string, (this: any, ...args: any[]) => any>;

export type InferRuntime<
  TRuntime extends GenericApiRuntime,
  TOptions extends TRuntime['options'],
> = TRuntime extends infer R
  ? R extends ApiRuntime<any, any, infer O, any, any>
    ? TOptions extends O
      ? R
      : never
    : never
  : never;

export type InferCoreRuntime<T extends CoreRuntime['options']> = InferRuntime<
  CoreRuntime,
  T
>;

export type InferEventsRuntime<T extends EventsRuntime['options']> =
  InferRuntime<EventsRuntime, T>;
