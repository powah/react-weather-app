import React from 'react';
import cn from 'classnames';

export default function WeatherIcon({ code, className, ...rest }) {
    const fontClassName =
        code[code.length - 1] === 'd'
            ? `owf owf-${code}-d`
            : code[code.length - 1] === 'n'
            ? `owf owf-${code}-n`
            : `owf owf-${code}`;

    return <i className={cn(className, fontClassName)} {...rest} />;
}
