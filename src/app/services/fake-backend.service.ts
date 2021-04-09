import { Injectable } from "@angular/core";
import produce, { Draft, Immutable } from "immer";
import { asapScheduler, BehaviorSubject, Observable, scheduled } from "rxjs";
import { delay, map, take } from "rxjs/operators";
import { AppState } from "../types/appState";
import { Note } from "../types/note";
import { User } from "../types/user";
import { UserTask } from "../types/userTask";

type AppStateTypes = User | UserTask | Note;
type IdKeys = "userId" | "taskId" | "noteId";

@Injectable({ providedIn: "root" })
export class FakeBackendService {
  private globalDelay = 500;

  private _fakeDatabase = new BehaviorSubject<Immutable<AppState>>({
    users: [
      {
        userId: 4,
        userName: "Jack"
      },
      {
        userId: 7,
        userName: "Jill"
      }
    ],
    tasks: [
      { userId: 4, taskId: 2, description: "Go over the hill", taskStatus: "Complete" },
      { userId: 4, taskId: 3, description: "Jump over the candlestick", taskStatus: "In Progress" },
      { userId: 7, taskId: 6, description: "Also jump over the candlestick", taskStatus: "Complete" },
    ],
    notes: [
      { userId: 4, taskId: 3, noteId: 1, text: "Jack fell" }
    ]
  });

  /** Public backend faux-API */

  // Demonstrate returning different types of state in one call.
  getUsersAndTasks() {
    return this.toDelayedSingleEmitter(
      this.selectAsync(s => {
        return { users: s.users, tasks: s.tasks };
      })
    );
  }

  addUser(user: User) {
    return this.addValue(s => s.users, "userId", user);
  }

  updateUser(userId: number, user: User) {
    return this.updateValue(s => s.users, s => s.userId === userId, user);
  }

  removeUser(userId: number) {
    return this.removeValue(s => s.users, s => s.userId === userId);
  }

  addTask(task: UserTask) {
    return this.addValue(s => s.tasks, "taskId", task);
  }

  updateTask(taskId: number, task: UserTask) {
    return this.updateValue(s => s.tasks, s => s.taskId === taskId, task);
  }

  removeTask(taskId: number) {
    return this.removeValue(s => s.tasks, s => s.taskId === taskId);
  }

  getNotes() {
    return this.toDelayedSingleEmitter(this.selectAsync(s => s.notes));
  }

  addNote(note: Note) {
    return this.addValue(s => s.notes, "noteId", note);
  }

  updateNote(noteId: number, note: Note) {
    return this.updateValue(s => s.notes, s => s.noteId === noteId, note);
  }

  removeNote(noteId: number) {
    return this.removeValue(s => s.notes, s => s.noteId === noteId);
  }

  /** Private helper methods */

  private _nextId = new BehaviorSubject<number>(5);

  private nextId() {
    this._nextId.next(this._nextId.value + 1);
    return this._nextId.value;
  }

  private toDelayedSingleEmitter<T>(obs: Observable<T>) {
    return obs
      .pipe(take(1)) // Only emit 1 value (similar to http.get)
      .pipe(delay(this.globalDelay)); // artifically delay the time until the value is emitted
  }

  private assignNewId<T extends AppStateTypes>(value: T, idKey: IdKeys) {
    const newValue = { ...value };

    switch (idKey) {
      case "userId":
        (newValue as User).userId = this.nextId();
        break;
      case "taskId":
        (newValue as UserTask).taskId = this.nextId();
        break;
      case "noteId":
        (newValue as Note).noteId = this.nextId();
        break;
    }

    return newValue;
  }

  private select<T>(selector: (s: Immutable<AppState>) => T) {
    return selector(this._fakeDatabase.value);
  }

  private selectAsync<T>(selector: (s: Immutable<AppState>, index?: number) => T) {
    return this._fakeDatabase.asObservable().pipe(map(selector));
  }

  private addValue<T extends AppStateTypes>(
    stateSelector: (s: Draft<AppState>) => T[],
    idKey: IdKeys,
    value: T
  ) {
    const newData = produce(this.select(s => s), draft => {
      const newValue = this.assignNewId(value, idKey);
      stateSelector(draft).push(newValue);
    });

    this._fakeDatabase.next(newData);

    return this.toDelayedSingleEmitter(scheduled([true], asapScheduler));
  }

  private updateValue<T extends AppStateTypes>(
    stateSelector: (s: Draft<AppState>) => T[],
    predicate: (value: T, index?: number) => boolean,
    value: T
  ) {
    const newData = produce(this.select(s => s), draft => {
      const selected = stateSelector(draft);
      const index = selected.findIndex(predicate);
      selected[index] = value;
    });

    this._fakeDatabase.next(newData);

    return this.toDelayedSingleEmitter(scheduled([true], asapScheduler));
  }

  private removeValue<T>(
    stateSelector: (s: Draft<AppState>) => T[],
    predicate: (value: T, index?: number) => boolean
  ) {
    const newData = produce(this.select(s => s), draft => {
      const selected = stateSelector(draft);
      const index = selected.findIndex(predicate);
      selected.splice(index, 1);
    });

    this._fakeDatabase.next(newData);

    return this.toDelayedSingleEmitter(scheduled([true], asapScheduler));
  }
}
