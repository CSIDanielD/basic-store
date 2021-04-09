import { Draft } from "immer";

export type Reducer<S, P> = ReducerWithPayload<S, P> | ReducerWithoutPayload<S>;

export type ReducerWithPayload<S, P> =
  | ((getState: () => Draft<S>, payload: P) => Draft<S>)
  | ((getState: () => Draft<S>, payload: P) => Promise<Draft<S>>);

export type ReducerWithoutPayload<S> =
  | ((getState: () => Draft<S>) => Draft<S>)
  | ((getState: () => Draft<S>) => Promise<Draft<S>>);

export type ReducerMap<S = any, P = any> = {
  [actionType: string]: Reducer<S, P>;
};