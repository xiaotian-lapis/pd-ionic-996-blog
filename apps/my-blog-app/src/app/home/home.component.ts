import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogActions, IBlogState, selectAllBlogs, selectBlogsViewStatus } from '@pd-ionic/blog-store';
import { Observable } from 'rxjs';
import { IBlog } from '@pd-ionic/shared-models';
import { Store } from '@ngrx/store';
import { BlogSortBy, SortOrder, ViewStatus } from '@pd-ionic/shared-constants';
import { equals, or } from '@pd-ionic/shared-utils';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pd-ionic-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements ViewWillEnter {
  protected readonly ViewStatus = ViewStatus;
  protected readonly equals = equals;
  protected readonly or = or;
  protected readonly sortBy = BlogSortBy;
  protected readonly sortOrder = SortOrder;
  protected currentSortBy: string = BlogSortBy.TITLE;
  protected currentSortOrder: string = SortOrder.ASC;
  private blogStore = inject(Store<IBlogState>);
  blogList$: Observable<IBlog[]> = this.blogStore.select(selectAllBlogs);
  viewStatus$: Observable<ViewStatus> = this.blogStore.select(
    selectBlogsViewStatus,
  );

  ionViewWillEnter() {
    this.initBlogList();
  }

  private initBlogList() {
    this.blogStore.dispatch(BlogActions.loadBlogs());
  }

  /**
   * Delete blog by id
   * @param blogId blog id
   */
  deleteBlog(blogId: string): void {
    this.blogStore.dispatch(
      BlogActions.removeBlog({
        id: blogId,
      }),
    );
  }

  /**
   * Sort blog list
   * @param field
   */
  onSortFieldChange(field: BlogSortBy) {
    this.currentSortBy = field;
    this.updateSorting();
  }

  /**
   * Sort blog list
   * @param order
   */
  onSortOrderChange(order: SortOrder) {
    this.currentSortOrder = order;
    this.updateSorting();
  }

  /**
   * Update sorting
   * @private
   */
  private updateSorting() {
    if (this.currentSortBy && this.currentSortOrder) {
      console.log('sortBlogs action triggered');
      console.log(
        `sort info: sortBy: ${this.currentSortBy}, sortOrder: ${this.currentSortOrder}`,
      );
      this.blogStore.dispatch(
        BlogActions.sortBlogs({
          sortBy: this.currentSortBy,
          sortOrder: this.currentSortOrder,
        }),
      );
    }
  }


}
