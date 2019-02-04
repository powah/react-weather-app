import React from 'react';
import Select from '../Select';
import PropTypes from 'prop-types';

class CitySelect extends React.PureComponent {
    render() {
        const { onSelect, ...rest } = this.props;
        return <Select {...rest} onSelect={onSelect} placeholder="Select city" items={items} />;
    }
}

CitySelect.propTypes = {
    onSelect: PropTypes.func.isRequired,
};

export default CitySelect;
