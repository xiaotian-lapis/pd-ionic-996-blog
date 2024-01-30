import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { IBlog } from '@pd-ionic/shared-models';

export const BlogActions = createActionGroup({
  source: 'Blog',
  events: {
    'Load Blogs': emptyProps(),
    'Add Blog': props<{
      id: string;
      author: string;
      title: string;
      description: string;
      content: string;
      createdTime: Date;
      updatedTime: Date;
      location: {
        lat: number;
        lng: number;
        addr: string;
      };
    }>(),
    'Remove Blog': props<{ id: string }>(),
    'Update Blog': props<{
      id: string;
      author: string;
      title: string;
      description: string;
      content: string;
      createdTime: Date;
      updatedTime: Date;
      location: {
        lat: number;
        lng: number;
        addr: string;
      };
    }>(),
    'Sort Blogs': props<{ sortBy: string; sortOrder: string }>()
  },
});

export const BlogApiActions = createActionGroup({
  source: 'Blog API',
  events: {
    'Blogs Loaded Success': props<{ blogs: IBlog[] | null }>(),
    'Blogs Loaded Error': props<{ error: { message: string } }>(),
  },
});
