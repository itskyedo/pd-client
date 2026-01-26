import { type ClientConfig } from '../client.ts';
import { type EventsRuntime } from '../events/events.ts';
import { type InferCoreRuntime, type RuntimeSchema } from '../types/runtime.ts';
import { type CoreV2, coreV2, type CoreV2Options } from './v2/runtime.ts';

export type CoreRuntime = CoreV2;

export type DefaultCoreRuntime = CoreV2;

export function core<
  const TOptions extends CoreRuntime['options'] = DefaultCoreRuntime['options'],
>(
  config: ClientConfig<TOptions, EventsRuntime['options']>,
): RuntimeSchema<InferCoreRuntime<TOptions>> {
  const version = config.core?.version ?? 2;
  let schema: RuntimeSchema;

  if (version === 2) {
    schema = coreV2(
      config as ClientConfig<CoreV2Options, EventsRuntime['options']>,
    );
  } else {
    throw new Error('Unsupported core client version');
  }

  return schema as RuntimeSchema<InferCoreRuntime<TOptions>>;
}
