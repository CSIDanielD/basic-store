import { Action } from "./action";
import { Reducer } from "./reducer";
import { InferActionCreatorFromAction } from "./utilityTypes";

/** Describes an ActionCreator + Reducer combo */
export interface ActionReducer<A extends Action, R extends Reducer<any, any>> {
  readonly actionCreator: InferActionCreatorFromAction<A>;
  readonly reducer: R;
}

export interface ActionReducerMap<
  A extends Action,
  R extends Reducer<any, any>
> {
  [key: string]: ActionReducer<A, R>;
}
