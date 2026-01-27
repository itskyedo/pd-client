import { type Client } from '../../../client.ts';
import { type EventsRuntime } from '../../../events/events.ts';
import { op } from '../../../operation.ts';
import { handleApiResponse } from '../../../response.ts';
import { type CoreV2 } from '../runtime.ts';

type Operation = typeof operation;
const operation = op<CoreV2>().define({
  path: '/addons/{id}',
  method: 'PUT',
});

export type UpdateAddonProps = Operation['~types']['body']['addon'];

export function updateAddon(
  this: Client<CoreV2, EventsRuntime>,
  id: Operation['~types']['path']['id'],
  props: UpdateAddonProps,
) {
  return handleApiResponse(
    this.fetchers.core[operation.method](operation.path, {
      params: {
        header: this.fetchers.core.defaults.header,
        path: {
          id,
        },
      },

      body: {
        addon: props,
      },
    }),
  );
}
