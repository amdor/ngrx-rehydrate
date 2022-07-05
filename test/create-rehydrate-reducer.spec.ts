import { ActionReducer, createAction, on, props, Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { createRehydrateReducer } from '../src';

interface State {
    substate: { flag: boolean };
}

const INITIAL_STATE = {
    flag: false,
};

const setAction = createAction('set', props<{ flag: boolean }>());

const selectFlag = (state: State) => state.substate.flag;

describe('createRehydrateReducer', () => {
    let rehydrateReducer: any;
    let store: Store<State>;

    beforeEach(() => {
        rehydrateReducer = createRehydrateReducer(
            { key: 'key1' },
            INITIAL_STATE,
            on(setAction, (state, { flag }) => ({ ...state, flag })),
        );

        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({ substate: rehydrateReducer })],
        });
        store = TestBed.inject(Store);
    });

    it('should set initial state as normal', (done) => {
        store.select(selectFlag).subscribe((flag) => {
            expect(flag).toBe(false);
            done();
        });
    });

    describe('when the state is modified', () => {
        beforeEach(() => {
            store.dispatch(setAction({ flag: true }));
        });

        it('should set the state fragment in localstorage', () => {
            const fragmentInStorage = JSON.parse(localStorage.getItem('key1')!);
            expect(fragmentInStorage).toEqual({ flag: true });
        });

        describe('and the store is created again', () => {
            beforeEach(() => {
                TestBed.resetTestingModule().configureTestingModule({
                    imports: [StoreModule.forRoot({ substate: rehydrateReducer })],
                });
                store = TestBed.inject(Store);
            });

            it('should rehydrate the state from storage', (done) => {
                store.select(selectFlag).subscribe((flag) => {
                    expect(flag).toBe(true);
                    done();
                });
            });
        });
    });
});
