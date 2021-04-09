import { Injectable } from '@angular/core';
import { createDraft } from 'immer';
import { withState } from '../basic-store/actionContext';
import { defaultState } from '../store/defaultState';
import { AppState } from '../types/appState';

const context = withState<AppState>();

@Injectable({
  providedIn: 'root'
})
export class StateUtilityService {
  resetState = context.createReducer.withoutPayload(getState => {
    return createDraft(defaultState); // Completely reset the current state to the default.
  });
}
