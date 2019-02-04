import React from 'react';
import PropTypes from 'prop-types';

const ClearIcon = ({ width }) => (
    <svg
        viewBox="0 0 20 20"
        preserveAspectRatio="none"
        width={width}
        fill="transparent"
        stroke="#979797"
        strokeWidth="1.1px"
    >
        <path d="M1,1 L19,19" />
        <path d="M19,1 L1,19" />
    </svg>
);

ClearIcon.defaultProps = {
    width: 12,
};

ClearIcon.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ClearIcon;
