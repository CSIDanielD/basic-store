import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { StoreService } from './store/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: StoreService) {
    store.selectAsync(s => s).pipe(skip(1))
      .subscribe(s => {
        console.log('State updated:', s);
        this.stateUpdates$.next(this.stateUpdates$.value + 1)
      });
  }

  stateUpdates$ = new BehaviorSubject(0);

  fetchUsers() {
    const { getUsersAndTasksAsync } = this.store.actions;
    this.store.dispatch(getUsersAndTasksAsync());
  }

  fetchNotes() {
    const { getNotesAsync } = this.store.actions;
    this.store.dispatch(getNotesAsync());
  }
}
