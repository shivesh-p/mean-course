import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  posts = [];
  isLoading: boolean = false;
  totalPosts: number = 0;
  pageSize: number = 5;
  currentPage = 1;
  isAuthenticated: boolean = false;
  constructor(private postService: PostsService, private auth: AuthService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, 1);
    this.postService.posts$.subscribe((posts) => {
      debugger;
      this.posts = posts.posts;
      this.totalPosts = posts.totalPosts;
      this.isLoading = false;
    });

    this.auth.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });
  }
  onDelete(id: string) {
    console.log(id);
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.pageSize, this.currentPage);
    });
    this.isLoading = false;
  }
  onPageChange(event: PageEvent) {
    debugger;
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;

    this.pageSize = event.pageSize;

    this.postService.getPosts(this.pageSize, this.currentPage);
  }
}
