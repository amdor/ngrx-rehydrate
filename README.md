# ngrx-rehydrate

Persists parts of the state to localStorage and automatically load them as initial state after refresh/revisit of the page.

## Usage

```typescript
export const exampleReducer = createRehydrateReducer(
    { key: 'key1' },
    INITIAL_STATE,
    on(setAction, (state, { flag }) => ({ ...state, flag })),
);
```

```typescript
function createRehydrateReducer<S, A extends Action = Action, R extends ActionReducer<S, A> = ActionReducer<S, A>>(
    config: RehydrateRecucerConfig,
    initialState: S,
    ...ons: ReducerTypes<S, ActionCreator[]>[]
): R 
```
where

| Param        | Description                                           |
| ------------ | ----------------------------------------------------- |
| config       | RehydrateRecucerConfig object for rehydration options |
| initialState | same as with the default `createReducer` function     |
| ons          | same as with the default `createReducer` function     |

## Refs

For more usage examples see the tests https://github.com/amdor/ngrx-rehydrate/blob/main/test/create-rehydrate-reducer.spec.ts

More on rehydration: https://medium.com/betsson-group/the-easiest-way-to-keep-ngrx-state-after-refresh-rehydrate-it-from-localstorage-8cd23b547aac

## Types

#### RehydrateRecucerConfig

| Property | Description                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| key      | the key to store the substate by. must be unique otherwise 2 state slices would try saving to the same `localStorage` key |
