import { type Client } from '../../../client.ts';
import { type EventsRuntime } from '../../../events/events.ts';
import { op } from '../../../operation.ts';
import { handleApiResponse } from '../../../response.ts';
import { type CoreV2 } from '../runtime.ts';

type Operation = typeof operation;
const operation = op<CoreV2>().define({
  path: '/addons',
  method: 'GET',
});

export interface ListAddonsProps {
  limit?: Operation['~types']['query']['limit'];
  offset?: Operation['~types']['query']['offset'];
  total?: Operation['~types']['query']['total'];
  filter?: Operation['~types']['query']['filter'];
  include?: [] | [Operation['~types']['query']['include[]']];
  serviceIds?: Operation['~types']['query']['service_ids[]'];
}

export function listAddons(
  this: Client<CoreV2, EventsRuntime>,
  props?: ListAddonsProps,
) {
  return handleApiResponse(
    this.fetchers.core[operation.method](operation.path, {
      params: {
        header: this.fetchers.core.defaults.header,
        query: {
          limit: props?.limit,
          offset: props?.offset,
          total: props?.total,
          filter: props?.filter,
          'include[]': props?.include?.[0],
          'service_ids[]': props?.serviceIds,
        },
      },
    }),
  );
}
