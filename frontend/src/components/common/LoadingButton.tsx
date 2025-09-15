import React from 'react';

interface LoadingButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    className: string;
    loadingText: string;
    children: React.ReactNode;
    type?: 'button' | 'submit';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
                                                         onClick,
                                                         isLoading = false,
                                                         disabled = false,
                                                         className,
                                                         loadingText,
                                                         children,
                                                         type = 'button'
                                                     }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={className}
        >
            {isLoading ? loadingText : children}
        </button>
    );
};

export default LoadingButton;