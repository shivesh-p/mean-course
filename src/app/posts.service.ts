import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Posts, PostsDto } from './general.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private baseUrl: string = environment.baseApiUrl;
  private posts: Posts[] = [];
  public posts$: Subject<{ posts: Posts[]; totalPosts: number }> = new Subject<{
    posts: Posts[];
    totalPosts: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, page: number) {
    let queryParams = `?pageSize=${pageSize}&page=${page}`;
    return this.http
      .get<PostsDto>(`${this.baseUrl}/posts` + queryParams)
      .pipe(
        map((v) => {
          return {
            posts: v.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                createdBy: post.createdBy,
              };
            }),
            totalPosts: v.totalPosts,
          };
        })
      )
      .subscribe((posts) => {
        this.posts = posts.posts;
        this.posts$.next({
          posts: [...this.posts],
          totalPosts: posts.totalPosts,
        });
      });
  }
  addPost(post: Posts, image: File) {
    debugger;
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http
      .post<{ message: string; post: Posts }>(`${this.baseUrl}/posts`, postData)
      .subscribe((res) => {
        this.router.navigate(['/list']);
      });
  }
  editPost(post: Posts, postId: string, image: File | string) {
    //debugger;
    post.id = postId;
    let postData: Posts | FormData;
    if (typeof image == 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = { ...post, imagePath: image, createdBy: null };
    }

    this.http
      .put<{ message: string; posts: Posts }>(
        `${this.baseUrl}/posts/` + postId,
        postData
      )
      .subscribe((res) => {
        this.router.navigate(['/list']);
      });
  }
  deletePost(postId: string) {
    //debugger;
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/posts/` + postId
    );
    // .subscribe((res) => {
    //   console.log(res.message);
    //   let filteredPosts = this.posts.filter((post) => {
    //     return post.id !== postId;
    //   });
    //   this.posts = filteredPosts;
    //   this.posts$.next(this.posts);
    // });
  }

  getPostById(id: string) {
    debugger;
    return this.http.get<{ message: string; posts: Posts }>(
      `${this.baseUrl}/posts/` + id
    );
  }
}
