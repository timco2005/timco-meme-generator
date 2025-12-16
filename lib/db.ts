'use client';

import { init, i, id } from '@instantdb/react';
import rules from '../instant.perms';

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID;

if (!APP_ID) {
  throw new Error(
    'NEXT_PUBLIC_INSTANTDB_APP_ID is required. Please set it in .env.local file. ' +
    'Get your App ID from https://instantdb.com/dashboard'
  );
}

export const schema = i.schema({
  entities: {
    memes: i.entity({
      imageUrl: i.string(),
      createdAt: i.number().indexed(),
      userId: i.string(),
    }),
    upvotes: i.entity({
      memeId: i.string().indexed(),
      userId: i.string().indexed(),
    }),
  },
  links: {
    memeUpvotes: {
      forward: { on: 'memes', has: 'many', label: 'upvotes' },
      reverse: { on: 'upvotes', has: 'one', label: 'meme' },
    },
  },
  rooms: {},
});

// @ts-ignore - InstantDB types may not be fully up to date
export const db = init({ appId: APP_ID, schema, rules });
export { id };

