import React from 'react';
import '../../css/Dashboard.css';

interface DashboardCardProps {
    title: string;
    value: string | number;
    description: string;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
    onClick?: () => void;
    icon?: React.ReactNode;
}

function DashboardCard({ title, value, description, color, onClick, icon }: DashboardCardProps) {
    return (
        <div 
            className={`dashboard-card ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <div className="card-content">
                <div className="card-header">
                    <div className="card-icon-container">
                        <div className={`card-icon ${color}-icon`}>
                            {icon || <div className="icon-dot"></div>}
                        </div>
                    </div>
                    <div className="card-info">
                        <dt className="card-title">{title}</dt>
                        <dd className="card-value">{value}</dd>
                        <dd className="card-description">{description}</dd>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardCard;