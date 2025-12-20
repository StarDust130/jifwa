import React, { ReactNode } from 'react';

interface PlatformLayoutProps {
    children: ReactNode;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ children }) => {
    return (
        <div className="platform-layout">
            {/* You can add platform-specific headers, navigation, or wrappers here */}
            {children}
        </div>
    );
};

// 🚀 Exporting the PlatformLayout component for use in the app
// This ensures the layout is available wherever it's imported
export default PlatformLayout;