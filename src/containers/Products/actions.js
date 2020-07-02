/*
 *
 * Admin actions
 *
 */

import {
  ACTIVATE_TRIAL,
  SET_FOOD_ADMIN_ORDERS,
  SET_ECOMMERCE_ADMIN_ORDERS,
  BUY_PLUGIN,
  DEFAULT_ACTION,
  GET_FOOD_ADMIN_ORDERS,
  GET_ECOMMERCE_ADMIN_ORDERS,
  GET_SUPERMARKET_ORDERS,
  SET_SUPERMARKET_ORDERS,
  SET_SUPERMARKET_ORDER,
  GET_SUPERMARKET_ORDER,
  ACCEPT_SUPERMARKET_ORDER,
  CANCEL_SUPERMARKET_ORDER,
  GET_VITRIN_PAGE_VIEWS,
  SET_VITRIN_CALL_BUTTON_CLICKS,
  GET_VITRIN_CALL_BUTTON_CLICKS,
  SET_VITRIN_PAGE_VIEWS,
  GET_FOOD_ADMIN_ORDER,
  GET_ECOMMERCE_ADMIN_ORDER,
  SET_FOOD_ADMIN_ORDER,
  SET_ECOMMERCE_ADMIN_ORDER,
  ACCEPT_FOOD_ORDER,
  ACCEPT_ECOMMERCE_ORDER,
  CANCEL_FOOD_ORDER,
  CANCEL_ECOMMERCE_ORDER,
  SEND_GROUP_VISIT_CARD,
  SEND_VISIT_CARD,
  SEND_CUSTOM_VISIT_CARD,
  SET_ADMIN_REVIEWS,
  GET_ADMIN_REVIEWS,
  GET_ADMIN_REVIEW,
  SET_ADMIN_REVIEW,
  SET_SELECTED_DELIVERY_DATE,
  CHANGE_CATEGORY_ORDER,
  NEW_SECTION_ORDERING,
  SET_GROUP_DISCOUNT,
  SET_DELIVERY_TIME,
  STOP_LOADING,
  START_LOADING,
} from "./constants";

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changeCategoryOrder(id, newIndex) {
  return {
    type: CHANGE_CATEGORY_ORDER,
    data: {
      id,
      newIndex,
    },
  };
}