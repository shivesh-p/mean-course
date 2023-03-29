import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Posts } from '../../general.model';
import { mimeType } from '../../mime-type.validator';
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
  form: FormGroup;
  imagePath: string | null = null;

  constructor(
    private postService: PostsService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(35),
      ]),
      image: new FormControl(null, [Validators.required], [mimeType]),
      content: new FormControl(null, [Validators.required]),
    });
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
            this.imagePath = this.post.imagePath;
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              //id: this.post.id,
              image: this.post.imagePath,
            });
          });
      } else {
        this.isEdit = false;
      }
    });
  }

  onImagePicked(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: file,
    });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePath = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    this.isLoading = true;
    if (!this.isEdit) {
      this.postService.addPost(this.form.value, this.form.value.image);
    } else {
      this.postService.editPost(
        this.form.value,
        this.postId,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
