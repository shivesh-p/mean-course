import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { LoginComponent } from '../auth/login/login.component';
import { SignUpComponent } from '../auth/signup/signup.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PostListComponent } from '../posts/post-list/post-list.component';
import { PostsCreateComponent } from '../posts/posts-create/posts-create.component';
import { CommonAuthComponent } from '../shared/common-auth/common-auth.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: PostListComponent },
  { path: 'create', component: PostsCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:id',
    component: PostsCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'auth', component: CommonAuthComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
