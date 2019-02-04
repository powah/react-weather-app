import React from 'react';
import Select from '../Select';
import countries from './countries';
import PropTypes from 'prop-types';

const items = countries.map(country => ({
    label: country.name,
    value: country.alpha2,
}));

class CountriesSelect extends React.PureComponent {
    render() {
        const { onSelect, ...rest } = this.props;
        return <Select {...rest} onSelect={onSelect} placeholder="Select country" items={items} />;
    }
}

CountriesSelect.propTypes = {
    onSelect: PropTypes.func.isRequired,
};

export default CountriesSelect;
