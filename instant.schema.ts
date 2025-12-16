import { i } from '@instantdb/react';

export default i.schema({
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

