/**
 *
 * AddNewItemSection
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { handleKeyDown } from "../../../utils/helper";
import { CDN_BASE_URL } from "../../../utils/api";
// import styled from 'styled-components';
const plusIcon = `${CDN_BASE_URL}plus-blue.svg`;

function AddNewProductCard({ onClick, className }) {
  return (
    <div
      className={`u-dashed-border cursorPointer d-flex flex-column m-1 u-relative c-business-card-custom u-background-light-grey ${className}`}
      onClick={onClick}
      onKeyDown={e => handleKeyDown(e, onClick)}
      role="button"
      tabIndex="0"
    >
      <div className="u-text-primary-blue d-flex justify-content-center align-items-center m-auto">
        <img className="ml-1" src={plusIcon} alt="" />
        محصول جدید
      </div>
    </div>
  );
}

AddNewProductCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

AddNewProductCard.defaultProps = {
  className: '',
};

export default memo(AddNewProductCard);
