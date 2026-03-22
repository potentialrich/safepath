import React, { useEffect, useRef } from 'react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = 'max-w-md',
}) => {
    const modalRef = useRef(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Handle click outside
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className={`w-full ${maxWidth} bg-surface border border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200`}
            >
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-border-subtle shrink-0">
                    <h2 className="font-heading font-bold text-xl text-text-main">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full text-text-subtle hover:text-text-main hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>
                
                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-border-subtle bg-black/20 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
