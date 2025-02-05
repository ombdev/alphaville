import { createSelector } from 'reselect';
import { patiosReducer, Patio, PatioSlice } from './patios.reducer';

const sliceSelector = (state: any) => state[patiosReducer.sliceName];

export const patiosSelector = createSelector(
  sliceSelector,
  (slice: PatioSlice) => slice.patios
);

export const patioSelector = createSelector(
  sliceSelector,
  (slice: PatioSlice): Patio | null => slice.patio,
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: PatioSlice) => slice.loading
);

export const patiosCatalogSelector = createSelector(
  sliceSelector,
  (slice: PatioSlice) =>
    slice.patios &&
    Array.isArray(slice.patios) &&
    slice.patios.map((patio: Patio) => {
      return {
        ...patio,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: PatioSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: PatioSlice) => slice.filters
);
