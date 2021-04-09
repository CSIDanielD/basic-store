import { Component } from '@angular/core';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  constructor(private store: StoreService) { }

  get users$() {
    return this.store.selectAsync(s => s.users);
  }
}