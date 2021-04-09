import { Immutable } from "immer";
import { AppState } from "../types/appState";

export const defaultState: Immutable<AppState> = {
    users: [],
    tasks: [],
    notes: []
};