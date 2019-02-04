import React from 'react';
import PropTypes from 'prop-types';

const ArrowIcon = ({ isOpen, width }) => (
    <svg
        viewBox="0 0 20 20"
        preserveAspectRatio="none"
        width={width}
        fill="transparent"
        stroke="#979797"
        strokeWidth="1.1px"
        transform={isOpen ? 'rotate(180)' : null}
    >
        <path d="M1,6 L10,15 L19,6" />
    </svg>
);

ArrowIcon.defaultProps = {
    isOpen: false,
    width: 16,
};

ArrowIcon.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ArrowIcon;
