import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the admin state domain
 */

const selectAdminDomain = (state) => state.ordersReport || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Admin
 */

const makeSelectAdmin = () =>
  createSelector(selectAdminDomain, (substate) => substate);
const makeSelectFoodAdminOrders = () =>
  createSelector(selectAdminDomain, (state) => state.foodAdminOrders);
const makeSelectFoodAdminOrdersPagination = () =>
  createSelector(selectAdminDomain, (state) => state.foodAdminOrdersPagination);
const makeSelectOrdersReport = () =>
  createSelector(selectAdminDomain, (state) => state.report);

export default makeSelectAdmin;
export {
  selectAdminDomain,
  makeSelectFoodAdminOrders,
  makeSelectFoodAdminOrdersPagination,
  makeSelectOrdersReport,
};