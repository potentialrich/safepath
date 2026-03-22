import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';

const SplineEmbed = ({
    sceneUrl,
    className = '',
    fallback = null,
    onLoad = () => {},
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = (spline) => {
        setIsLoading(false);
        onLoad(spline);
    };

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                    {fallback || (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                            <span className="font-data text-[10px] text-text-subtle tracking-widest uppercase">Loading 3D Engine...</span>
                        </div>
                    )}
                </div>
            )}
            
            <Spline 
                scene={sceneUrl} 
                onLoad={handleLoad}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default SplineEmbed;
