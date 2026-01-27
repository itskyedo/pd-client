import { type Client } from '../../../client.ts';
import { type EventsRuntime } from '../../../events/events.ts';
import { op } from '../../../operation.ts';
import { handleApiResponse } from '../../../response.ts';
import { type CoreV2 } from '../runtime.ts';

type Operation = typeof operation;
const operation = op<CoreV2>().define({
  path: '/addons/{id}',
  method: 'GET',
});

export function getAddon(
  this: Client<CoreV2, EventsRuntime>,
  id: Operation['~types']['path']['id'],
) {
  return handleApiResponse(
    this.fetchers.core[operation.method](operation.path, {
      params: {
        header: this.fetchers.core.defaults.header,
        path: {
          id,
        },
      },
    }),
  );
}
