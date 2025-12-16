'use client';

import { init, i, id } from '@instantdb/react';

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || '12dda760-fc25-4f9d-96a2-aa7dbb592f0c';

export const schema = i.schema({
  entities: {
    memes: i.entity({
      imageUrl: i.string(),
      createdAt: i.number().indexed(),
      userId: i.string(),
    }),
    upvotes: i.entity({
      memeId: i.string(),
      userId: i.string(),
    }),
  },
  links: {
    memeUpvotes: {
      forward: { on: 'memes', has: 'many', label: 'upvotes' },
      reverse: { on: 'upvotes', has: 'one', label: 'meme' },
    },
  },
});

export const db = init({ appId: APP_ID, schema });
export { id };

