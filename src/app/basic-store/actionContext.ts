import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from "./action";
import { Reducer, ReducerMap, ReducerWithoutPayload, ReducerWithPayload } from "./reducer";
import {
  InferActionReducerFromReducer,
  InferActionReducerMapFromReducerMap
} from "./utilityTypes";

/**
 * Create a "Context" for ActionReducer creation methods. This is shorthand for `new ActionContext<State>()`,
 * but it doesn't allow passing the `contextName` parameter.
 * @see ActionContext
 */
export function withState<State>() {
  return new ActionContext<State>();
}

/**
 * Create a "Context" for ActionReducer creation methods.
 * This is a currying function used to inject the provided State type into its returned methods
 * to allow Typescript's type inference to work correctly. Typescript doesn't support partial
 * type inference (you either provide all generic params or none), so this is the way around that.
 */
export class ActionContext<State> {
  constructor(public contextName?: string) { }

  get createReducer() {
    function withPayload<P>(reducer: ReducerWithPayload<State, P>) {
      return reducer as ReducerWithPayload<State, P>;
    }

    function withoutPayload(reducer: ReducerWithoutPayload<State>) {
      return reducer as ReducerWithoutPayload<State>;
    }

    return { withPayload: withPayload, withoutPayload: withoutPayload }
  }

  createReducerMap<M extends ReducerMap<State, any>>(map: M): M {
    return map;
  }

  createActionCreator<P>(
    type: string
  ): ActionCreatorWithPayload<P> | ActionCreatorWithoutPayload {
    const actionType =
      this.contextName && this.contextName.trim().length > 0
        ? `${this.contextName.trim()}/${type.trim()}`
        : `${type.trim()}`;

    return (payload: P) => {
      return { type: actionType, payload: payload };
    };
  }

  createActionReducerMap<M extends ReducerMap<State, any>>(
    reducerMap: M
  ): InferActionReducerMapFromReducerMap<M> {
    const actionReducerMap = Object.entries(reducerMap).reduce(
      (map, entry) => {
        const [actionType, reducer] = entry;

        const actionReducer: InferActionReducerFromReducer<typeof reducer> = {
          actionCreator: this.createActionCreator(actionType),
          reducer: reducer
        };

        map[actionType] = actionReducer;

        return map;
      },
      {} as { [actionType: string]: any }
    );

    return actionReducerMap as InferActionReducerMapFromReducerMap<M>;
  }
}
