// eslint-disable-next-line import/consistent-type-specifier-style
import type {
  components,
  paths,
} from '../../_generated/openapi-events-v1.d.ts';
import { type ClientConfig } from '../../client.ts';
import { type CoreRuntime } from '../../core/core.ts';
import { createFetcher, type Fetcher } from '../../fetcher.ts';
import { type MediaType } from '../../types/openapi.ts';
import {
  type ApiRuntime,
  type BaseApiRuntimeOptions,
  type GenericMethods,
  type RuntimeSchema,
} from '../../types/runtime.ts';

export interface EventsV1 extends ApiRuntime<
  paths,
  components,
  EventsV1Options,
  Fetcher<
    paths,
    MediaType,
    {
      header: {
        Accept: 'application/json';
        'Content-Type': 'application/json';
        Authorization: `Token token=${string}`;
      };
    }
  >,
  EventsV1Methods
> {}

export interface EventsV1Options extends BaseApiRuntimeOptions<1> {}

export function eventsV1(
  config: ClientConfig<CoreRuntime['options'], EventsV1['options']>,
): RuntimeSchema<EventsV1> {
  return {
    methods,
    fetcher: createFetcher({
      baseUrl:
        !config.region || config.region === 'us'
          ? 'https://events.pagerduty.com/generic/2010-04-15'
          : `https://events.${config.region}.pagerduty.com/generic/2010-04-15`,

      defaults: {
        header: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Token token=${config.token}`,
        },
      },
    }),
  };
}

export type EventsV1Methods = typeof methods;

const methods = {} as const satisfies GenericMethods;
