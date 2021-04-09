import { Note } from "./note";
import { User } from "./user";
import { UserTask } from "./userTask";

export interface AppState {
  users: User[];
  tasks: UserTask[];
  notes: Note[];
}
