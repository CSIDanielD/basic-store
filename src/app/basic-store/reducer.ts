// export type Reducer<S, P> = IsNonUndefined<
//   P,
//   IsUnknown<P, ReducerWithoutPayload<S>, ReducerWithPayload<S, P>>,
//   ReducerWithoutPayload<S> // If reducer has an unknown or undefined payload, it's a ReducerWithoutPayload
// >;

export type Reducer<S, P> = ReducerWithPayload<S, P> | ReducerWithoutPayload<S>;

export type ReducerWithPayload<S, P> =
  | ((getState: () => S, payload: P) => S)
  | ((getState: () => S, payload: P) => Promise<S>);

export type ReducerWithoutPayload<S> =
  | ((getState: () => S) => S)
  | ((getState: () => S) => Promise<S>);

export type ReducerMap<S = any, P = any> = {
  [actionType: string]: Reducer<S, P>;
};
