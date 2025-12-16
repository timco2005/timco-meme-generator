import type { InstaQLEntity } from '@instantdb/react';
import { schema } from './db';

export type MemeEntity = InstaQLEntity<typeof schema, 'memes'>;
export type UpvoteEntity = InstaQLEntity<typeof schema, 'upvotes'>;

export interface TextBoxData {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  borderColor: string;
  borderThickness: number;
  x: number;
  y: number;
}

export interface MemeTemplate {
  name: string;
  url: string;
}

