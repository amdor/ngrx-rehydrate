import { Action, ActionCreator, ActionReducer, ActionType, createReducer, ReducerTypes } from '@ngrx/store';
import { OnReducer } from '@ngrx/store/src/reducer_creator';
import { RehydrateRecucerConfig } from './model';

export function createRehydrateReducer<
    S,
    A extends Action = Action,
    R extends ActionReducer<S, A> = ActionReducer<S, A>,
>(config: RehydrateRecucerConfig, initialState: S, ...ons: ReducerTypes<S, ActionCreator[]>[]): R {
    const { key } = config;
    const item = localStorage.getItem(key);
    const newInitialState = (item && JSON.parse(item)) ?? initialState;

    const newOns: ReducerTypes<S, ActionCreator[]>[] = [];
    ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
        const newReducer: OnReducer<S, ActionCreator[]> = (state: S, action: ActionType<ActionCreator[][number]>) => {
            const newState = oldOn.reducer(state, action);
            localStorage.setItem(key, JSON.stringify(newState));
            return newState;
        };
        newOns.push({ ...oldOn, reducer: newReducer });
    });
    return createReducer<S, A, R>(newInitialState, ...newOns);
}
