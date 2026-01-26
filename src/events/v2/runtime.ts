// eslint-disable-next-line import/consistent-type-specifier-style
import type {
  components,
  paths,
} from '../../_generated/openapi-events-v2.d.ts';
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

export interface EventsV2 extends ApiRuntime<
  paths,
  components,
  EventsV2Options,
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
  EventsV2Methods
> {}

export interface EventsV2Options extends BaseApiRuntimeOptions<2> {}

export function eventsV2(
  config: ClientConfig<CoreRuntime['options'], EventsV2['options']>,
): RuntimeSchema<EventsV2> {
  return {
    methods,
    fetcher: createFetcher({
      baseUrl:
        !config.region || config.region === 'us'
          ? 'https://events.pagerduty.com/v2'
          : `https://events.${config.region}.pagerduty.com/v2`,

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

export type EventsV2Methods = typeof methods;

const methods = {} as const satisfies GenericMethods;
