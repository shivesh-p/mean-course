import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Posts } from '../../general.model';
import '../../ng-form.extension';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostsCreateComponent {
  isEdit: boolean = false;
  isLoading: boolean = false;
  postId: string | null = null;
  post: Posts;

  constructor(
    private postService: PostsService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('id')) {
        this.postId = params.get('id');
        this.isEdit = true;
        this.isLoading = true;
        this.postService
          .getPostById(this.postId)
          .subscribe((v: { message: string; posts: Posts }) => {
            this.post = v.posts;
            this.isLoading = false;
          });
      } else {
        this.isEdit = false;
      }
    });
  }
  onSubmit(form: NgForm) {
    this.isLoading = true;
    if (!this.isEdit) {
      this.postService.addPost(form.value);
    } else {
      this.postService.editPost(form.value, this.postId);
    }
    form.resetForm();
  }
}
