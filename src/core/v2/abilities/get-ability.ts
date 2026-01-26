import { type Client } from '../../../client.ts';
import { type EventsRuntime } from '../../../events/events.ts';
import { op } from '../../../operation.ts';
import { handleApiResponse } from '../../../response.ts';
import { type CoreV2 } from '../runtime.ts';

type Operation = typeof operation;
const operation = op<CoreV2>().define({
  path: '/abilities/{id}',
  method: 'GET',
});

export function getAbility(
  this: Client<CoreV2, EventsRuntime>,
  id: Operation['~params']['path']['id'],
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
