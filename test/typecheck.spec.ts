import { createAction, createFeatureSelector, createReducer, on, props, Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { createRehydrateReducer } from '../src/create-rehydrate-reducer';

export const addPhotoToFavs = createAction('Add photo to Favorites', props<{ photoID: number }>());
export const removePhotoFromFavs = createAction('Remove photo from Favorites', props<{ photoID: number }>());

export interface FavoritePhotoState {
    favoritePhotoList: Array<number>;
}

const initialState: FavoritePhotoState = {
    favoritePhotoList: [],
};

const favoritePhotoStateSelector = createFeatureSelector<FavoritePhotoState>('favoritePhotoState');

describe('createRehydrateReducer', () => {
    let rehydrateReducer: any;
    let store: Store<FavoritePhotoState>;

    beforeEach(() => {
        rehydrateReducer = createRehydrateReducer(
            { key: 'key1' },
            initialState,
            on(addPhotoToFavs, (state, action) => ({
                favoritePhotoList: [...state.favoritePhotoList, action.photoID],
            })),
            on(removePhotoFromFavs, (state, action) => ({
                favoritePhotoList: [...state.favoritePhotoList.filter((value) => value != action.photoID)],
            })),
        );

        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({
                    favoritePhotoState: rehydrateReducer,
                }),
            ],
        });
        store = TestBed.inject(Store);
    });

    it('should set initial state as normal', (done) => {
        store.select(favoritePhotoStateSelector).subscribe((state) => {
            expect(state.favoritePhotoList).toEqual([]);
            done();
        });
    });

    describe('when the state is modified', () => {
        beforeEach(() => {
            store.dispatch(addPhotoToFavs({ photoID: 0 }));
        });

        it('should set the state fragment in localstorage', () => {
            const fragmentInStorage = JSON.parse(localStorage.getItem('key1')!);
            expect(fragmentInStorage.favoritePhotoList).toEqual([0]);
        });
    });
});
