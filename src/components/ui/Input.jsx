import React, { forwardRef } from 'react';

const Input = forwardRef(({
    className = '',
    icon,
    error,
    wrapperClassName = '',
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col gap-1 w-full ${wrapperClassName}`}>
            <div className={`
                flex-grow bg-card rounded-xl flex items-center transition-all overflow-hidden border
                ${error ? 'border-danger focus-within:ring-danger/40' : 'border-[#1C2E4A] focus-within:ring-accent/40 focus-within:bg-[#1C2E4A]'}
                focus-within:ring-2
            `}>
                {icon && (
                    <div className="pl-4 text-text-muted/50">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full bg-transparent border-none outline-none px-4 py-3 text-base font-medium text-text-main 
                        placeholder:text-text-muted/40
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-danger text-sm ml-2">{error}</span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
