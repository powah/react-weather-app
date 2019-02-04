import React from 'react';
import Select from '../Select';
import PropTypes from 'prop-types';

class CountriesSelect extends React.PureComponent {
    render() {
        const { onSelect, items, ...rest } = this.props;
        return <Select {...rest} onSelect={onSelect} placeholder="Select country" items={items} />;
    }
}

CountriesSelect.propTypes = {
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default CountriesSelect;
