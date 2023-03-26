import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PostListComponent } from '../posts/post-list/post-list.component';
import { PostsCreateComponent } from '../posts/posts-create/posts-create.component';

const routes: Routes = [
  { path: '',pathMatch:'full', component: PostListComponent },
  { path: 'create', component: PostsCreateComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

