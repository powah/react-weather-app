import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import ClearIcon from './ClearIcon';
import ArrowIcon from './ArrowIcon';
import cn from 'classnames';
import styles from './select.module.scss';

class Select extends React.Component {
    render() {
        const { onSelect, items, placeholder, ...rest } = this.props;

        return (
            <Downshift onChange={onSelect} itemToString={item => (item ? item.label : '')}>
                {({
                    getInputProps,
                    getToggleButtonProps,
                    getItemProps,
                    isOpen,
                    toggleMenu,
                    clearSelection,
                    selectedItem,
                    inputValue,
                    highlightedIndex,
                }) => (
                    <div {...rest}>
                        <div className={styles.container}>
                            <div className={styles.inputContainer}>
                                <input
                                    {...getInputProps({
                                        placeholder,
                                        type: 'text',
                                        className: cn(styles.input, {
                                            [styles['input--open']]: isOpen,
                                        }),
                                    })}
                                />
                                {selectedItem ? (
                                    <button
                                        className={styles.button}
                                        onClick={clearSelection}
                                        aria-label="clear selection"
                                    >
                                        <ClearIcon />
                                    </button>
                                ) : (
                                    <button className={styles.button} {...getToggleButtonProps()}>
                                        <ArrowIcon isOpen={isOpen} />
                                    </button>
                                )}
                            </div>

                            {isOpen && (
                                <div className={styles.list}>
                                    {items
                                        .filter(
                                            ({ label }) =>
                                                !inputValue ||
                                                label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                                        )
                                        .map((item, index) => (
                                            <div
                                                {...getItemProps({
                                                    index,
                                                    item,
                                                    key: item.value,
                                                })}
                                                className={cn(styles.listItem, {
                                                    [styles['listItem--active']]: highlightedIndex === index,
                                                    [styles['listItem--selected']]: selectedItem === item.value,
                                                })}
                                            >
                                                {item.label}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Downshift>
        );
    }
}

Select.defaultProps = {
    items: [],
    placeholder: 'Select..',
};

Select.propTypes = {
    onSelect: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Select;
