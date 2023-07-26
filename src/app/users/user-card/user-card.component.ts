import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input('userData') userData!: User;
  @Output('editUser') editUser: EventEmitter<null> = new EventEmitter();

  userEditEvent() {
    this.editUser.emit();
  }

}
