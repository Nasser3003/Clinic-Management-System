import React from 'react';
import '../css/heroHeader.css';

interface HeroHeaderProps {
    title: string;
    subtitle: string;
}

function HeroHeader({ title, subtitle }: HeroHeaderProps) {
    return (
        <div className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>
            </div>
        </div>
    );
}

export default HeroHeader;