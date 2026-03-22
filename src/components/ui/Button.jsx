import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    fullWidth = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-heading font-bold rounded-full transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover shadow-[0_0_20px_rgba(255,74,154,0.4)]',
        secondary: 'bg-white/10 hover:bg-white/20 border border-border-subtle text-white backdrop-blur-sm',
        ghost: 'text-text-muted hover:text-accent hover:bg-surface',
        danger: 'bg-danger text-white hover:bg-red-600 shadow-lg',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-10 py-5 text-lg',
    };

    const classes = `
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
