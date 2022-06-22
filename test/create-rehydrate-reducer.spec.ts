import { ActionReducer, createAction, on, props, Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { createRehydrateReducer } from '../src';

interface State {
    flag: boolean;
}

const INITIAL_STATE = {
    flag: false,
};

const setAction = createAction('set', props<{ flag: boolean }>());

const selectFlag = (state: State) => state.flag;

describe('createRehydrateReducer', () => {
    let rehydrateReducer: any;
    let store: Store<State>;
    let localStorageMock: any;

    beforeEach(() => {
        localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });
        rehydrateReducer = createRehydrateReducer(
            { key: 'key1' },
            INITIAL_STATE,
            on(setAction, (state, { flag }) => ({ ...state, flag })),
        );

        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({ state: rehydrateReducer })],
        });
        store = TestBed.inject(Store);
    });

    it('should set initial state as normal', (done) => {
        store.select(selectFlag).subscribe((flag) => {
            expect(flag).toBeFalsy();
            done();
        });
    });

    describe('when the state is set', () => {
        beforeEach(() => {
            store.dispatch(setAction({ flag: true }));
        });

        it('should set the state fragment in localstorage', () => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith('key1', JSON.stringify({ flag: true }));
        });
    });
});
