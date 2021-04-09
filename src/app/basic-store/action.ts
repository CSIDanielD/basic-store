import { IsUnknown } from "./utilityTypes";

export interface Action<P = any> {
  type: string;
  payload: P;
}

export type ActionCreator<P> = IsUnknown<
  P,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload<P>
>;
export type ActionCreatorWithPayload<P> = (payload: P) => Action<P>;
export type ActionCreatorWithoutPayload = () => Action<undefined>;
