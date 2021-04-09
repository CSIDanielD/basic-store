import { Injectable } from "@angular/core";
import { BasicStore } from "../basic-store/basicStore";
import { defaultState } from "./defaultState";
import { ActionProviderService } from "./action-provider.service";

@Injectable({ providedIn: "root" })
export class StoreService {
    // Create the store instance with the default state and registered providers
    store = new BasicStore(defaultState, this.actionProvider.provider);

    /**
     * A convenience object containing every action key mapped to its action creator.
     * @use Use the object destructuring syntax to extract whichever registered action(s) you
     * need like this: `const { actionA, actionB } = store.actions;`
     * @remarks Note that for async actions, the async call is only done *in the reducer*, not in the action creator.
     * You can safely call these action creators synchronously and cache the actions they create to reuse elsewhere.
     */
    get actions() {
        return this.store.actions;
    }

    /**
     * Select all or a part of the current state value synchronously.
     * @param selector The selector that will be called with the current state value.
     */
    get select() {
        const fn = this.store.select;
        const bound = fn.bind(this.store);
        return bound as typeof fn;
    }

    /**
     * Select all or a part of the current state value synchronously.
     * @param selector The selector that will be called with the current state value.
     */
    get selectAsync() {
        const fn = this.store.selectAsync;
        const bound = fn.bind(this.store);
        return bound as typeof fn;
    }

    /**
     * Dispatch an action to update the current state. This is the only way to update the state's value.
     * @param action The action to dispatch. The action's 'type' string must match one of the registered reducers.
     */
    get dispatch() {
        const fn = this.store.dispatch;
        const bound = fn.bind(this.store);
        return bound as typeof fn;
    }

    constructor(protected actionProvider: ActionProviderService) { }
}
