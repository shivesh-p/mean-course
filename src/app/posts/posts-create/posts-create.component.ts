import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../../posts.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css'],
})
export class PostsCreateComponent {
  private isEdit: boolean = false;
  private postId: string | null = null;

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
      }
      else {
        this.isEdit = false;
      }
    });
  }
  onSubmit(form: NgForm) {
    this.postService.addPost(form.value);
    form.reset();
  }
}
