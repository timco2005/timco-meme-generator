// InstantDB rules configuration
// Note: Using @ts-ignore in db.ts as InstantDB types may not be fully up to date
const rules = {
  memes: {
    allow: {
      // Anyone can view memes (public feed)
      view: 'auth.id != null',
      // Users can create their own memes
      create: 'auth.id != null',
      // Users can only update their own memes
      update: 'isOwner',
      // Users can only delete their own memes
      delete: 'isOwner',
    },
    bind: [
      // Check if the current user is the owner of the meme
      'isOwner',
      'auth.id != null && auth.id == data.userId',
    ],
  },
  upvotes: {
    allow: {
      // Anyone can view upvotes (to see counts)
      view: 'auth.id != null',
      // Users can create upvotes (upvote memes)
      create: 'auth.id != null',
      // Users can update their own upvotes (though typically not needed)
      update: 'isOwner',
      // Users can delete their own upvotes (unupvote)
      delete: 'isOwner',
    },
    bind: [
      // Check if the current user is the owner of the upvote
      'isOwner',
      'auth.id != null && auth.id == data.userId',
    ],
  },
};

export default rules;

