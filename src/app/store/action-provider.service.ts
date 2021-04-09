import { Injectable } from '@angular/core';
import { createProviderFrom } from '../basic-store/actionProvider';
import { NoteService } from '../services/note.service';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ActionProviderService {
  /** 
 * These are all the actions that are provided to the store. To add a new provider, 
 * inject it into this service and add a .mergeProvider({...this.your_service}) here. 
 * You will need to use the spread operator syntax (see link) here for your provider's actions to be correctly merged.
 * 
 * Also note that that your action provider's public properties can ONLY be Reducer methods. You *are allowed* to have
 * other properties on the object, but they have to have the `protected` or `private` modifier.
 * 
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
 * */
  private _mergedActionProviders = createProviderFrom({ ...this.userService })
    .mergeProvider({ ...this.taskService })
    .mergeProvider({ ...this.noteService });


  provider = this._mergedActionProviders.provider;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private noteService: NoteService) { }
}
