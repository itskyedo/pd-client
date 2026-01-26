import {
  core,
  type CoreRuntime,
  type DefaultCoreRuntime,
} from './core/core.ts';
import {
  type DefaultEventsRuntime,
  events,
  type EventsRuntime,
} from './events/events.ts';
import { type ServiceRegion } from './types/domain.ts';
import {
  type InferCoreRuntime,
  type InferEventsRuntime,
} from './types/runtime.ts';

export interface ClientBase<
  TCore extends CoreRuntime,
  TEvents extends EventsRuntime,
> {
  config: ClientConfig<TCore['options'], TEvents['options']>;
  fetchers: {
    core: TCore['fetcher'];
    events: TEvents['fetcher'];
  };
}

export type Client<
  TCore extends CoreRuntime,
  TEvents extends EventsRuntime,
> = ClientBase<TCore, TEvents> & TCore['methods'] & TEvents['methods'] & {};

export interface ClientConfig<
  TCoreOpts extends CoreRuntime['options'],
  TEventsOpts extends EventsRuntime['options'],
> {
  token: string;
  region?: ServiceRegion;
  core?: TCoreOpts;
  events?: TEventsOpts;
}

export function createClient<
  const TCoreOpts extends CoreRuntime['options'] =
    DefaultCoreRuntime['options'],
  const TEventsOpts extends EventsRuntime['options'] =
    DefaultEventsRuntime['options'],
>(
  config: ClientConfig<TCoreOpts, TEventsOpts>,
): Client<InferCoreRuntime<TCoreOpts>, InferEventsRuntime<TEventsOpts>> {
  const coreSchema = core(config);
  const eventsSchema = events(config);

  return {
    ...coreSchema.methods,
    ...eventsSchema.methods,
    config,
    fetchers: {
      core: coreSchema.fetcher,
      events: eventsSchema.fetcher,
    },
  } as Client<InferCoreRuntime<TCoreOpts>, InferEventsRuntime<TEventsOpts>>;
}
