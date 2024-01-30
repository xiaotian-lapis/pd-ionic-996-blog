import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, IBlogState } from './blog.reducer';
import { BLOGS_STATE_NAME } from '@pd-ionic/shared-constants';
import { IBlog } from '@pd-ionic/shared-models';


export const selectBlogState =
  createFeatureSelector<IBlogState>(BLOGS_STATE_NAME);

export const {
  selectIds: selectBlogIds,
  selectEntities: selectBlogEntities,
  selectAll: selectAllBlogs,
  selectTotal: selectTotalBlogs,
} = adapter.getSelectors(selectBlogState);

export const selectBlogsError = createSelector(
  selectBlogState,
  (state: IBlogState) => state.error,
);

export const selectBlogsViewStatus = createSelector(
  selectBlogState,
  (state: IBlogState) => state.viewStatus,
);

export const selectBlogById = createSelector(
  selectBlogEntities,
  (entities: any, props: { id: string }) => entities[props.id] as IBlog,
);
