import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostsCreateComponent {
  constructor(private postService: PostsService) {}

  onSubmit(form: NgForm) {
    this.postService.addPost(form.value);
    form.reset();
  }
}
