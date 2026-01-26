import { type Client } from '../../../client.ts';
import { type EventsRuntime } from '../../../events/events.ts';
import { op } from '../../../operation.ts';
import { handleApiResponse } from '../../../response.ts';
import { type CoreV2 } from '../runtime.ts';

const operation = op<CoreV2>().define({
  path: '/abilities',
  method: 'GET',
});

export function listAbilities(this: Client<CoreV2, EventsRuntime>) {
  return handleApiResponse(
    this.fetchers.core[operation.method](operation.path, {
      params: {
        header: this.fetchers.core.defaults.header,
      },
    }),
  );
}
