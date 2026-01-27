import { type Client } from '../../../client.ts';
import { type EventsRuntime } from '../../../events/events.ts';
import { op } from '../../../operation.ts';
import { handleApiResponse } from '../../../response.ts';
import { type CoreV2 } from '../runtime.ts';

type Operation = typeof operation;
const operation = op<CoreV2>().define({
  path: '/addons',
  method: 'POST',
});

export type CreateAddonProps = Operation['~types']['body']['addon'];

export function createAddon(
  this: Client<CoreV2, EventsRuntime>,
  props: CreateAddonProps,
) {
  return handleApiResponse(
    this.fetchers.core[operation.method](operation.path, {
      params: {
        header: this.fetchers.core.defaults.header,
      },

      body: {
        addon: props,
      },
    }),
  );
}
