import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  columns: Array<string> = [
    'serial',
    'avatar',
    'name',
    'email',
    'age',
    'country',
    'edit',
  ];
  usersList: Array<User> = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.usersList = this.userService.getUsersList();
  }

  editUser(id: number): void {
    this.router.navigate(['/users/user/edit/', id + 1]);
  }

  convertJsonToXlsx() {
    this.userService.convertJsonToXlsx(this.usersList);
  }
}
