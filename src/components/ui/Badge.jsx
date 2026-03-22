import React from 'react';

const Badge = ({
    children,
    variant = 'info',
    className = '',
}) => {
    const variants = {
        info: 'bg-accent text-background border border-accent',
        danger: 'bg-danger/20 text-danger border border-danger/30',
        success: 'bg-success/20 text-success border border-success/30',
        neutral: 'bg-white/10 text-text-muted border border-border-subtle',
    };

    const classes = `
        inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
        ${variants[variant]}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <span className={classes}>
            {children}
        </span>
    );
};

export default Badge;
