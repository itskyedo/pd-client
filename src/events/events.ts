import { type ClientConfig } from '../client.ts';
import { type CoreRuntime } from '../core/core.ts';
import {
  type InferEventsRuntime,
  type RuntimeSchema,
} from '../types/runtime.ts';
import { type EventsV1, eventsV1 } from './v1/runtime.ts';
import { type EventsV2, eventsV2 } from './v2/runtime.ts';

export type EventsRuntime = EventsV1 | EventsV2;

export type DefaultEventsRuntime = EventsV2;

export function events<
  const TOptions extends EventsRuntime['options'] =
    DefaultEventsRuntime['options'],
>(
  config: ClientConfig<CoreRuntime['options'], TOptions>,
): RuntimeSchema<InferEventsRuntime<TOptions>> {
  const version = config.events?.version ?? 2;
  let schema: RuntimeSchema;

  if (version === 1) {
    schema = eventsV1(
      config as ClientConfig<CoreRuntime['options'], EventsV1['options']>,
    );
  } else if (version === 2) {
    schema = eventsV2(
      config as ClientConfig<CoreRuntime['options'], EventsV2['options']>,
    );
  } else {
    throw new Error('Unsupported events client version');
  }

  return schema as RuntimeSchema<InferEventsRuntime<TOptions>>;
}
