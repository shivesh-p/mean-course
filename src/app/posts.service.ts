import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, map } from 'rxjs';
import { Posts, PostsDto } from './general.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private baseUrl: string = 'http://localhost:3000/api';
  private posts: Posts[] = [];
  public posts$: Subject<Posts[]> = new Subject<Posts[]>();
  constructor(private http: HttpClient, private router: Router) {}
  getPosts() {
    return this.http
      .get<PostsDto>(`${this.baseUrl}/posts`)
      .pipe(
        map((v) => {
          return v.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.posts$.next([...this.posts]);
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
        this.posts.push(post);
        this.posts$.next(this.posts);
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
      postData = { ...post, imagePath: image };
    }

    this.http
      .put<{ message: string; posts: Posts }>(
        `${this.baseUrl}/posts/` + postId,
        postData
      )
      .subscribe((res) => {
        let updatedPosts = [...this.posts];
        let updatedIndex = updatedPosts.findIndex((post) => post.id === postId);
        updatedPosts[updatedIndex] = res.posts;
        this.posts = updatedPosts;
        this.posts$.next([...this.posts]);
        this.router.navigate(['/list']);
      });
  }
  deletePost(postId: string) {
    //debugger;
    this.http
      .delete<{ message: string }>(`${this.baseUrl}/posts/` + postId)
      .subscribe((res) => {
        console.log(res.message);
        let filteredPosts = this.posts.filter((post) => {
          return post.id !== postId;
        });
        this.posts = filteredPosts;
        this.posts$.next(this.posts);
      });
  }

  getPostById(id: string) {
    debugger;
    return this.http.get<{ message: string; posts: Posts }>(
      `${this.baseUrl}/posts/` + id
    );
  }
}
