import createClient, { type Client, type ClientOptions } from 'openapi-fetch';
import { type MediaType, type OpenApiPaths } from './types/openapi.ts';
export interface FetcherDefaults {
  header?: Record<string, any>;
}

export interface Fetcher<
  TPaths extends OpenApiPaths = OpenApiPaths,
  TMedia extends MediaType = MediaType,
  TDefaults extends FetcherDefaults = FetcherDefaults,
> extends Client<TPaths, TMedia> {
  defaults: TDefaults;
}

export interface FetcherOptions<
  TDefaults extends FetcherDefaults,
> extends ClientOptions {
  defaults: TDefaults;
}

export function createFetcher<
  TPaths extends OpenApiPaths,
  TMedia extends MediaType,
  TDefaults extends FetcherDefaults,
>(options: FetcherOptions<TDefaults>): Fetcher<TPaths, TMedia, TDefaults> {
  const client = createClient<TPaths, TMedia>(options);

  return Object.create(Object.getPrototypeOf(client) as object, {
    ...Object.getOwnPropertyDescriptors(client),

    defaults: {
      value: Object.freeze({
        ...options.defaults,
      }),
      writable: false,
      enumerable: true,
      configurable: false,
    },
  }) as Fetcher<TPaths, TMedia, TDefaults>;
}
