import React from 'react';
import '../../css/Dashboard.css';

interface AppointmentCardProps {
    date: string;
    time?: string;
    doctor?: string;
    patient?: string;
    type: string;
    status: 'completed' | 'upcoming' | 'pending' | 'cancelled';
    onAction?: () => void;
    actionLabel?: string;
    showApprovalButtons?: boolean;
    onApprove?: () => void;
    onDeny?: () => void;
}

function AppointmentCard({ 
    date, 
    time, 
    doctor, 
    patient, 
    type, 
    status, 
    onAction, 
    actionLabel = 'View Details',
    showApprovalButtons = false,
    onApprove,
    onDeny
}: AppointmentCardProps) {
    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return (
                    <svg className="checkmark-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'upcoming':
                return (
                    <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                );
            case 'pending':
                return (
                    <svg className="clock-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
            case 'cancelled':
                return (
                    <svg className="x-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <div className={`visit-item ${status}-visit`}>
            <div className="visit-info">
                <div className={`visit-icon ${status}-icon`}>
                    {getStatusIcon()}
                </div>
                <div className="visit-details">
                    <p className="visit-type">
                        {type}
                        {doctor && ` with Dr. ${doctor}`}
                        {patient && ` - ${patient}`}
                    </p>
                    <p className="visit-date">
                        {new Date(date).toLocaleDateString()}
                        {time && ` at ${time}`}
                    </p>
                </div>
            </div>
            <div className="visit-actions">
                {showApprovalButtons && status === 'pending' ? (
                    <div className="approval-buttons">
                        <button 
                            className="approve-btn"
                            onClick={onApprove}
                        >
                            Approve
                        </button>
                        <button 
                            className="deny-btn"
                            onClick={onDeny}
                        >
                            Deny
                        </button>
                    </div>
                ) : (
                    <>
                        {onAction && (
                            <button className="view-details-btn" onClick={onAction}>
                                {actionLabel}
                            </button>
                        )}
                        <span className={`visit-status ${status}-status`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

export default AppointmentCard;