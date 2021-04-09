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

    store.latestAction$.subscribe(a => {
      const nextActions = [...this.lastFiveActions$.value];

      if (nextActions.unshift(a.type) > 5) {
        nextActions.pop();  // Remove the first (earliest) action
      }

      this.lastFiveActions$.next(nextActions);
    });
  }

  stateUpdates$ = new BehaviorSubject(0);
  lastFiveActions$ = new BehaviorSubject<string[]>([]);

  resetState() {
    const { resetState } = this.store.actions;
    this.store.dispatch(resetState());
  }

  addUsers() {
    const { addUserAsync } = this.store.actions;
    this.store.dispatch(addUserAsync({ userId: 44, userName: "Bill" }));
  }

  fetchUsers() {
    const { getUsersAndTasksAsync } = this.store.actions;
    this.store.dispatch(getUsersAndTasksAsync());
  }

  fetchNotes() {
    const { getNotesAsync } = this.store.actions;
    this.store.dispatch(getNotesAsync());
  }
}
