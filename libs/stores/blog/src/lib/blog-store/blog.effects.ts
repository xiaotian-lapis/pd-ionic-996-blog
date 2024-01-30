import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { BlogService } from '@pd-ionic/blog-service';
import { Store } from '@ngrx/store';
import { selectBlogsViewStatus } from './blog.selector';
import { ViewStatus } from '@pd-ionic/shared-constants';
import { equals } from '@pd-ionic/shared-utils';
import { BlogActions, BlogApiActions } from './blog.action';
import { IBlogState } from './blog.reducer';

@Injectable()
export class BlogEffects {

  private readonly blogService = inject(BlogService);
  private readonly store: Store<IBlogState> = inject(Store);
  private readonly actions$ = inject(Actions);

  loadBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogs),
      // select Initialized info from store to determine whether to load blog from backend api
      concatLatestFrom(() => this.store.select(selectBlogsViewStatus)),
      mergeMap(([_, viewStatus]) => {
        if (equals(viewStatus, ViewStatus.Reloading)) {
          // already initialized, don't load blog from backend api
          return of(BlogApiActions.blogsLoadedSuccess({ blogs: null }));
        } else {
          // not initialized, load blog from backend api
          return this.blogService.getBlogs().pipe(
            map((blogs) => BlogApiActions.blogsLoadedSuccess({ blogs })),
            catchError((error: { message: string }) =>
              of(BlogApiActions.blogsLoadedError({ error })),
            ),
          );
        }
      }),
    ),
  );
}
