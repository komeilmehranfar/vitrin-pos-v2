/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectBusiness = state => state.business || initialState;

const makeSelectBusiness = () =>
  createSelector(
    selectBusiness,
    state => state.business,
  );

const makeSelectPosts = () =>
  createSelector(
    selectBusiness,
    state => state.business.posts,
  );

const makeSelectCategories = () =>
  createSelector(
    selectBusiness,
    state => state.business.deal_categories,
  );
const makeSelectProducts = () =>
  createSelector(
    selectBusiness,
    state => {
      const products = [];
      state.business.deal_categories.map(category => {
        category.deals.map(product => {
          if (!products.filter(p => p.title === product.title).length)
            products.push(product);
          return false;
        });
        return false;
      });
      return products;
    },
  );

const makeSelectCategory = id =>
  createSelector(
    selectBusiness,
    state =>
      state.business.deal_categories.find(category => category.id === id),
  );

const makeSelectBusinessThemeColor = () =>
  createSelector(
    selectBusiness,
    state => (state.business ? state.business.theme_config.theme_color : null),
  );
const makeSelectBusinessFoodDemo = () =>
  createSelector(
    selectBusiness,
    () => true,
  );
const makeSelectBusinessSlug = () =>
  createSelector(
    selectBusiness,
    state => state.business.slug,
  );

const makeSelectBusinessSiteDomain = () =>
  createSelector(
    selectBusiness,
    state => 'olddowntown',
  );

const makeSelectBusinessTitle = () =>
  createSelector(
    selectBusiness,
    state => state.business.revised_title,
  );

const makeSelectBusinessPhone = () =>
  createSelector(
    selectBusiness,
    state => state.business.phone_zero_starts,
  );

const makeSelectBusinessLocation = () =>
  createSelector(
    selectBusiness,
    state => ({
      latitude: state.business.latitude,
      longitude: state.business.longitude,
    }),
  );

const makeSelectBusinessId = () =>
  createSelector(
    selectBusiness,
    state => state.business.id,
  );

const makeSelectBusinessCallToActionKeyword = () =>
  createSelector(
    selectBusiness,
    state =>
      state.business.theme_config.menu_keyword_for_vitrin ||
      state.business.menu_keyword_for_vitrin,
  );

const makeSelectBusinessThemeConfig = () =>
  createSelector(
    selectBusiness,
    state => state.business.theme_config,
  );

const makeSelectBusinessCoverImage = () =>
  createSelector(
    selectBusiness,
    state => state.business.cover_image_url,
  );

const makeSelectBusinessWorkingHours = () =>
  createSelector(
    selectBusiness,
    state => state.business.work_hours,
  );

const makeSelectPost = id =>
  createSelector(
    selectBusiness,
    state => state.business.posts.find(post => post.id === id),
  );

const makeSelectProduct = id =>
  createSelector(
    selectBusiness,
    state =>
      state.business.deal_categories.find(category =>
        category.deals
          .find(product => product.id === id)
          .deals.find(product => product.id === id),
      ),
  );

export {
  makeSelectProduct,
  makeSelectBusiness,
  makeSelectPosts,
  makeSelectPost,
  makeSelectCategories,
  makeSelectCategory,
  makeSelectBusinessThemeColor,
  makeSelectBusinessLocation,
  makeSelectBusinessCallToActionKeyword,
  makeSelectBusinessId,
  makeSelectBusinessTitle,
  makeSelectBusinessPhone,
  makeSelectBusinessSlug,
  makeSelectBusinessThemeConfig,
  makeSelectBusinessCoverImage,
  makeSelectBusinessSiteDomain,
  makeSelectBusinessWorkingHours,
  makeSelectProducts,
  makeSelectBusinessFoodDemo,
};
