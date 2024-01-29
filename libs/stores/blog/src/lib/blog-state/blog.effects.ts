import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { BlogService } from '@pd-ionic/blog-service';
import { Store } from '@ngrx/store';
import { selectBlogsViewStatus } from './blog.selector';
import { ViewStatus } from '@pd-ionic/shared-constants';
import { equals } from '@pd-ionic/shared-utils';
import { BlogActions } from './blog.action';

@Injectable()
export class BlogEffects {
  loadBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogs),
      // select Initialized info from store to determine whether to load blog from backend api
      concatLatestFrom(() => this.store.select(selectBlogsViewStatus)),
      mergeMap(([_, viewStatus]) => {
        if (equals(viewStatus, ViewStatus.Reloading)) {
          // already initialized, don't load blog from backend api
          return of(BlogActions.blogsLoadedSuccess({ blogs: null }));
        } else {
          // not initialized, load blog from backend api
          return this.blogService.getBlogs().pipe(
            map((blogs) => BlogActions.blogsLoadedSuccess({ blogs })),
            catchError((error: { message: string }) =>
              of(BlogActions.blogsLoadedError({ error })),
            ),
          );
        }
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private blogService: BlogService,
    private store: Store,
  ) {}
}
