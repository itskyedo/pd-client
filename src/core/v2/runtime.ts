// eslint-disable-next-line import/consistent-type-specifier-style
import type { components, paths } from '../../_generated/openapi-core-v2.d.ts';
import { type ClientConfig } from '../../client.ts';
import { type EventsRuntime } from '../../events/events.ts';
import { createFetcher, type Fetcher } from '../../fetcher.ts';
import { type Email } from '../../types/domain.ts';
import { type MediaType } from '../../types/openapi.ts';
import {
  type ApiRuntime,
  type BaseApiRuntimeOptions,
  type GenericMethods,
  type RuntimeSchema,
} from '../../types/runtime.ts';
import { getAbility } from './abilities/get-ability.ts';
import { listAbilities } from './abilities/list-abilities.ts';
import { listAddons } from './addons/list-addons.ts';

export interface CoreV2 extends ApiRuntime<
  paths,
  components,
  CoreV2Options,
  Fetcher<
    paths,
    MediaType,
    {
      header: {
        Accept: `application/json, application/vnd.pagerduty+json;version=2`;
        'Content-Type': 'application/json';
        Authorization: `Token token=${string}`;
        From: string | undefined;
      };
    }
  >,
  CoreV2Methods
> {}

export interface CoreV2Options extends BaseApiRuntimeOptions<2> {
  defaultFrom?: Email;
}

export function coreV2(
  config: ClientConfig<CoreV2Options, EventsRuntime['options']>,
): RuntimeSchema<CoreV2> {
  return {
    methods,
    fetcher: createFetcher({
      baseUrl:
        !config.region || config.region === 'us'
          ? 'https://api.pagerduty.com'
          : `https://api.${config.region}.pagerduty.com`,

      defaults: {
        header: {
          Accept: `application/json, application/vnd.pagerduty+json;version=2`,
          'Content-Type': 'application/json',
          Authorization: `Token token=${config.token}`,
          From: config.core?.defaultFrom,
        },
      },
    }),
  };
}

export type CoreV2Methods = typeof methods;

const methods = {
  listAbilities,
  getAbility,
  listAddons,
} as const satisfies GenericMethods;
