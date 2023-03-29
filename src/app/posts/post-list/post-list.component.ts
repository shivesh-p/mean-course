import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  posts = [];
  isLoading: boolean = false;
  totalPosts: number;
  pageSize: number = 5;
  constructor(private postService: PostsService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = true;
    this.postService.getPosts();
    this.postService.posts$.subscribe((posts) => {
      this.posts = posts;
      this.totalPosts = posts.length;
      this.isLoading = false;
    });
  }
  onDelete(id: string) {
    console.log(id);
    this.isLoading = true;
    this.postService.deletePost(id);
    this.isLoading = false;
  }
  onPageChange(event: PageEvent) {}
}
