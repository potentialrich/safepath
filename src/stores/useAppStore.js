import { create } from 'zustand';

export const useAppStore = create((set) => ({
    // App configuration
    theme: 'dark', // safepath is natively dark, but preparing for future flexibility
    isFeatureEnabled: (featureName) => {
        const flags = {
            'friend-sharing': false,
            '3d-models': false,
            'user-accounts': false,
        };
        return flags[featureName] || false;
    },
    
    // UI State
    isMobileMenuOpen: false,
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
    
    // Global Error State
    globalError: null,
    setGlobalError: (error) => set({ globalError: error }),
    clearError: () => set({ globalError: null }),
}));
