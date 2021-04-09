import { castImmutable, createDraft, Draft, finishDraft, Immutable } from "immer";
import { BehaviorSubject, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Action } from "./action";
import { ActionContext } from "./actionContext";
import { ReducerMap } from "./reducer";
import { Selector } from "./selector";
import {
  InferActionCreatorMapFromActionReducerMap,
  InferActionReducerMapFromReducerMap
} from "./utilityTypes";

export class BasicStore<S, R extends ReducerMap<S, any>> {
  protected _state: BehaviorSubject<Immutable<S>>;

  protected _actionReducers: BehaviorSubject<
    Immutable<InferActionReducerMapFromReducerMap<R>>
  >;

  protected _actionCreators: BehaviorSubject<
    Immutable<
      InferActionCreatorMapFromActionReducerMap<
        InferActionReducerMapFromReducerMap<R>
      >
    >
  >;

  protected _dispatcher = new Subject<Action<any>>();

  /**
   * A convenience object containing every action key mapped to its action creator.
   * @use Use the object destructuring syntax to extract whichever registered action(s) you
   * need like this: `const { actionA, actionB } = store.actions;`
   */
  get actions() {
    return this._actionCreators.value;
  }

  get latestAction$() {
    return this._dispatcher.asObservable();
  }

  /**
   * Select all or a part of the current state value synchronously.
   * @param selector The selector that will be called with the current state value.
   */
  select<T>(selector: Selector<Immutable<S>, T>) {
    return selector(this._state.value);
  }

  /**
   * Select all or a part of the current state value as an Observable. Useful if you want to use your
   * selected state in a display component or async logic.
   * @param selector The selector that will be supplied to the RxJs `map` operator.
   */
  selectAsync<T>(selector: Selector<Immutable<S>, T>) {
    return this._state.asObservable().pipe(map(selector));
  }

  /**
   * Dispatch an action to update the current state. This is the only way to update the state's value.
   * @param action The action to dispatch. The action's 'type' string must match one of the registered reducers.
   */
  dispatch<A extends Action<any>>(action: A) {
    // TODO: Type check could probably be changed to only allow actions that are in _actionReducers
    if (!this._actionReducers.value[action.type]) {
      throw new Error(`No action registered with type '${action.type}'!`);
    }

    this._dispatcher.next(action);
  }

  /**
   * Dispatches the action to its registered reducer and updates the current state with
   * the reducer's returned value.
   */
  protected async _commitAction<A extends Action<any>>(action: A) {
    const { reducer } = this._actionReducers.value[action.type];

    const stateFn = () => createDraft(this._state.value as S);
    const reducerPromise = new Promise<Draft<S>>((resolve, reject) => {
      return resolve(reducer(stateFn, action.payload));
    });

    const newState = finishDraft(await reducerPromise) as S;
    this._state.next(castImmutable(newState));
  }

  protected _buildActionCreatorMap() {
    const actionCreators = Object.entries(this._actionReducers.value).reduce(
      (map, entry) => {
        const [actionType, actionReducer] = entry;
        map[actionType] = actionReducer.actionCreator;
        return map;
      },
      {} as { [actionType: string]: any }
    );

    return actionCreators as Immutable<
      InferActionCreatorMapFromActionReducerMap<
        InferActionReducerMapFromReducerMap<R>
      >
    >;
  }

  constructor(initialState: S, reducers: R) {
    this._state = new BehaviorSubject(castImmutable(initialState));

    this._actionReducers = new BehaviorSubject(
      castImmutable(new ActionContext<S>().createActionReducerMap(reducers))
    );

    // Memoize the action creator map
    this._actionCreators = new BehaviorSubject(this._buildActionCreatorMap());

    // Automatically update the memoized actionCreators in the extremely unlikely event that it updates during runtime.
    this._actionReducers.subscribe(() => {
      this._actionCreators.next(this._buildActionCreatorMap());
    });

    // Automatically commit actions to mutate the state
    this._dispatcher.subscribe(action => this._commitAction(action));
  }
}
