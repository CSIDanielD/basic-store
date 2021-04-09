import { Injectable } from '@angular/core';
import { castDraft } from 'immer';
import { withState } from '../basic-store/actionContext';
import { AppState } from '../types/appState';
import { User } from '../types/user';
import { FakeBackendService } from './fake-backend.service';

// Create a handy context to easily create strongly-type reducer functions
const context = withState<AppState>();

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private fakeBackend: FakeBackendService) { }

  getUsersAndTasksAsync = context.createReducer.withoutPayload(async getState => {
    // Fetch & await data from the fake API
    const usersAndTasks = await this.fakeBackend.getUsersAndTasks().toPromise();

    // Get the current state after awaiting
    const state = getState();

    state.users = castDraft(usersAndTasks.users);
    state.tasks = castDraft(usersAndTasks.tasks);

    return state;
  });

  addUserAsync = context.createReducer.withPayload(async (getState, user: User) => {
    // Fetch & await data from the fake API
    const result = await this.fakeBackend.addUser(user).toPromise();

    // Get the current state after awaiting
    const state = getState();

    if (result) {
      state.users.push(user);
    }

    return state;
  });

  updateUserAsync = context.createReducer.withPayload(
    async (getState, payload: { userId: number; user: User }) => {
      // Fetch & await data from the fake API
      const result = await this.fakeBackend
        .updateUser(payload.userId, payload.user)
        .toPromise();

      // Get the current state after awaiting
      const state = getState();

      if (result) {
        const foundIndex = state.users.findIndex(
          u => u.userId === payload.userId
        );

        state.users.splice(foundIndex, 1, payload.user);
      }

      return state;
    }
  );

  removeUserAsync = context.createReducer.withPayload(async (getState, userId: number) => {
    // Fetch & await data from the fake API
    const result = await this.fakeBackend.removeUser(userId).toPromise();

    // Get the current state after awaiting
    const state = getState();

    if (result) {
      const foundIndex = state.users.findIndex(u => u.userId === userId);

      state.users.splice(foundIndex, 1);
    }

    return state;
  });
}
