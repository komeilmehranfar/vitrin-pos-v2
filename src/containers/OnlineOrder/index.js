/* eslint-disable react/no-danger */
/**
 *
 * AdminOrder
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import {
  englishNumberToPersianNumber,
  persianToEnglishNumber
} from '../../../utils/helper';
import { PrimaryButton } from '../../components/Button';
import { makeSelectLoading } from '../App/selectors';
import { makeSelectFoodAdminOrder } from './selectors';
import Icon from '../../components/Icon';
import {
  acceptFoodOrder, cancelFoodOrder,
  getFoodAdminOrder,
  setDeliveryTime
} from './actions';
import { makeSelectBusiness } from '../../../stores/business/selector';
import { ICONS } from '../../../assets/images/icons';
import Input from '../../components/Input';
import ItemsSection from './components/ItemsSection';
import DeliverySection from './components/DeliverySection';
import PriceSection from './components/PriceSection';
import { useInjectReducer } from '../../../utils/injectReducer';
import { useInjectSaga } from '../../../utils/injectSaga';
import saga from './saga';
import reducer from './reducer';
import PrintButton from './PrintButton';

export function OnlineOrder({
                              adminOrder: order,
                              loading,
                              _getAdminOrder,
                              match,
                              _acceptOrder,
                              _cancelOrder,
                              history,
                              business,
                              _setDeliveryTime
                            }) {
  useInjectReducer({ key: 'adminOrder', reducer });
  useInjectSaga({ key: 'adminOrder', saga });

  useEffect(() => {
    setTimeout(() => {
      _getAdminOrder({ id: match.params.id });
    }, 0);
  }, []);
  const [duration, setDuration] = useState('');
  const accept = () => {
    _acceptOrder({ id: order.id, plugin: 'food', deliveryTime: duration ? parseInt(duration, 10) * 60 : '' });
  };
  return (
    <div className="d-flex flex-1 u-border-radius-8 mx-5 mt-5">
      <div className="u-background-melo-grey container-shadow flex-1">
        <div className="text-center u-fontMedium u-text-dark-grey py-2 u-background-white">
          <div className="px-3 u-text-darkest-grey">
            جزییات سفارش
            <Icon
              className="c-modal-header-close float-right"
              icon={ICONS.CLOSE}
              size={25}
              onClick={() => history.push('/online-orders')}
              color="#949c9f"
            />
          </div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <ItemsSection order={order}/>
          <DeliverySection order={order}/>
          <PriceSection order={order}/>
          <div className="px-3 u-background-white u-height-70 d-flex w-100 mt-1 py-3 u-fontWeightBold">
            {order.order_status === 0 && <>
              <PrimaryButton isLoading={loading} onClick={accept} className="mx-2" text="تایید سفارش"/>
              <PrimaryButton isLoading={loading} onClick={() => {
                _cancelOrder({ id: order.id });
              }} className="mx-2 u-text-primary-blue" bgColor="white"
                             style={{ border: '1px solid #168fd5' }} text="لغو سفارش"/></>}

            {order.order_status === 1 || order.order_status === 3 ?
              <div
                className="text-center u-text-green mx-2 u-border-radius-8 d-flex justify-content-center align-items-center"
                style={{ width: '200%', border: '1px solid #67b977' }}>سفارش با
                موفقیت تایید شد.</div> : null}
            {order.order_status === 2 ?
              <div
                className="text-center u-text-red mx-2 u-border-radius-8 d-flex justify-content-center align-items-center"
                style={{ width: '200%', border: '1px solid #E13F18' }}>سفارش لغو شد.</div> : null}

            <PrintButton order={order} business={business}/>
            {order.user_address && (
              <a href={`tel:${order.user_address.phone}`}
                 className="w-100 mx-2 px-2 u-cursor-pointer u-text-white d-flex justify-content-center align-items-center u-background-dark-grey u-border-radius-8">
                <Icon icon={ICONS.PHONE} className="ml-1" color="white" size={24} width={15} height={15}/>
                تماس با مشتری
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="u-relative u-background-white container-shadow u-border-radius-8 mr-4"
           style={{ width: 395, height: 'fit-content' }}>

        <div className="d-flex flex-column flex-1 p-3">
          <div className="u-text-black u-fontWeightBold">
            حداکثر زمان آماده‌سازی و ارسال
          </div>

          <div className="u-text-black u-fontMedium mt-2">
            مدت زمان تخمینی آماده‌سازی و ارسال این سفارش را وارد کنید.
          </div>
          <Input
            className="mt-2"
            noModal
            numberOnly
            label="مدت زمان (دقیقه)"
            value={duration ? englishNumberToPersianNumber(duration) : ''}
            onChange={value => setDuration(persianToEnglishNumber(value))}
          />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  adminOrder: makeSelectFoodAdminOrder(),
  loading: makeSelectLoading(),
  business: makeSelectBusiness()
});

function mapDispatchToProps(dispatch) {
  return {
    _getAdminOrder: data => dispatch(getFoodAdminOrder(data)),
    _acceptOrder: data => dispatch(acceptFoodOrder(data)),
    _cancelOrder: data => dispatch(cancelFoodOrder(data)),
    _setDeliveryTime: data => dispatch(setDeliveryTime(data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  memo,
  withRouter,
  withConnect
)(OnlineOrder);