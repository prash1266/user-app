import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { User } from '../user';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  mode: string = 'New';
  userAvatar: string = '';
  userForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[A-Za-z .]*')],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    dob: new FormControl('', { validators: [Validators.required] }),
    country: new FormControl('', { validators: [Validators.required] }),
  });
  countries: Array<{
    name: string;
    dial_code: string;
    code: string;
  }> = [];
  countrySubscription!: Subscription;
  userEdit!: User;
  userId!: number;
  maxDate = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((res) => {
      if (res['id']) {
        this.mode = 'Edit';
        this.userId = res['id'];
        this.userEdit = this.userService.getUserById(res['id']);
        console.log(this.userEdit);
        if (this.userEdit) {
          this.userAvatar = `${
            this.userService.userAvatarLink
          }&size=80&seed=${this.userEdit.name.charAt(0)}`;
          this.setFormValue();
        } else {
          this.userService.openSnackBar('User not found');
        }
      }
    });
    this.countrySubscription = this.userService
      .getCountries()
      .subscribe((countries) => {
        this.countries = countries;
      });
  }

  setFormValue() {
    this.userForm.patchValue(this.userEdit);
  }

  onNameInput(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    if (value) {
      this.userAvatar = `${
        this.userService.userAvatarLink
      }&size=80&seed=${value.charAt(0)}`;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    this.userService.saveUser({
      ...this.userForm.value,
      avatar: `${
        this.userService.userAvatarLink
      }&size=32&seed=${this.userForm.value.name!.charAt(0)}`,
    }, this.userId);
    this.router.navigate(['/users/list']);
  }

  ngOnDestroy(): void {
    this.countrySubscription.unsubscribe();
  }
}
