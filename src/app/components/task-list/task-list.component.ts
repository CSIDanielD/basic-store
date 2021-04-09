import { Component } from '@angular/core';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  constructor(private store: StoreService) { }

  get tasks$() {
    return this.store.selectAsync(s => s.tasks);
  }
}