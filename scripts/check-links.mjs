import { opportunities } from '../lib/opportunities.ts';
const queue = [
  ...new Map(
    opportunities.flatMap((o) =>
      [o.url, o.sourceUrl]
        .filter(Boolean)
        .map((url) => [url, { id: o.id, url }]),
    ),
  ).values(),
];
let next = 0;
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (next < queue.length) {
      const { id, url } = queue[next++];
      try {
        const response = await fetch(url, {
          redirect: 'follow',
          signal: AbortSignal.timeout(20000),
          headers: {
            'User-Agent': 'Mapping-LinkCheck/1.0 (editorial URL verification)',
          },
        });
        console.log(
          JSON.stringify({ id, status: response.status, url: response.url }),
        );
        await response.body?.cancel();
      } catch (e) {
        console.log(
          JSON.stringify({ id, status: 'unverified', reason: e.name, url }),
        );
      }
    }
  }),
);
