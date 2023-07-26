import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: UsersListComponent },
      {
        path: 'user/create',
        component: UserCreateComponent,
        data: { mode: 'New' },
      },
      {
        path: 'user/edit/:id',
        component: UserCreateComponent,
        data: { mode: 'Edit' },
      },
    ],
  },
  { path: '**', redirectTo: 'users', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
