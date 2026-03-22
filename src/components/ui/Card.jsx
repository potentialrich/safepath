import React from 'react';

const Card = ({
    children,
    className = '',
    hover = false,
    ...props
}) => {
    const baseStyles = 'bg-surface border border-border-subtle rounded-[2rem] p-8 shadow-2xl overflow-hidden relative';
    const hoverStyles = hover ? 'transition-transform duration-300 hover:-translate-y-2' : '';

    const classes = `
        ${baseStyles}
        ${hoverStyles}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
