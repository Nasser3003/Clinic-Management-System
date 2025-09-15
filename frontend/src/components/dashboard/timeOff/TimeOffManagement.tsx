import React, {useEffect, useState} from 'react';
import {useAuth} from '../../../context/AuthContext';
import Layout from '../../Layout';
import '../../css/TimeoffManagement.css'

interface TimeOffRequest {
    id?: number;
    startDateTime: string;
    endDateTime: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED';
    approvedBy?: string;
    approvalNotes?: string;
    createdAt?: string;
    employeeEmail?: string;
    employeeName?: string;
}

interface TimeOffApproval {
    status: 'APPROVED' | 'DECLINED';
    approvalNotes: string;
}

function TimeOffManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'my-requests' | 'new-request' | 'approve-requests'>('my-requests');
    const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
    const [pendingRequests, setPendingRequests] = useState<TimeOffRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // New request form state
    const [newRequest, setNewRequest] = useState({
        startDateTime: '',
        endDateTime: '',
        reason: ''
    });

    const isAdmin = user?.role === 'ADMIN';
    const isEmployee = ['DOCTOR', 'NURSE', 'EMPLOYEE', 'LAB_TECHNICIAN', 'RECEPTIONIST'].includes(user?.role || '');

    useEffect(() => {
        if (activeTab === 'my-requests') {
            loadMyTimeOffRequests();
        } else if (activeTab === 'approve-requests' && isAdmin) {
            loadPendingRequests();
        }
    }, [activeTab]);

    const loadMyTimeOffRequests = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/timeoff/employee', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTimeOffRequests(data);
            } else {
                throw new Error('Failed to load time off requests');
            }
        } catch (err: any) {
            console.error('Error loading time off requests:', err);
            setError('Failed to load time off requests');
        } finally {
            setLoading(false);
        }
    };

    const loadPendingRequests = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/timeoff/pending', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingRequests(data);
            } else {
                throw new Error('Failed to load pending requests');
            }
        } catch (err: any) {
            console.error('Error loading pending requests:', err);
            setError('Failed to load pending requests');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitNewRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        // Validation
        if (!newRequest.startDateTime || !newRequest.endDateTime) {
            setError('Please select both start and end dates');
            setSubmitting(false);
            return;
        }

        if (new Date(newRequest.startDateTime) >= new Date(newRequest.endDateTime)) {
            setError('End date must be after start date');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/timeoff/employee/${user?.email}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRequest)
            });

            if (response.ok) {
                setSuccess('Time off request submitted successfully!');
                setNewRequest({ startDateTime: '', endDateTime: '', reason: '' });
                setActiveTab('my-requests');
                loadMyTimeOffRequests();
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to submit time off request');
            }
        } catch (err: any) {
            console.error('Error submitting time off request:', err);
            setError(err.message || 'Failed to submit time off request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleApproveRequest = async (requestId: number, approval: TimeOffApproval) => {
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch(`/api/timeoff/${requestId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(approval)
            });

            if (response.ok) {
                setSuccess(`Request ${approval.status.toLowerCase()} successfully!`);
                loadPendingRequests();
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to process approval');
            }
        } catch (err: any) {
            console.error('Error processing approval:', err);
            setError('Failed to process approval');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRequest = async (requestId: number) => {
        if (!window.confirm('Are you sure you want to delete this time off request?')) {
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await fetch(`/api/timeoff/${requestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setSuccess('Time off request deleted successfully!');
                loadMyTimeOffRequests();
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to delete request');
            }
        } catch (err: any) {
            console.error('Error deleting request:', err);
            setError('Failed to delete request');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'approved';
            case 'DECLINED': return 'declined';
            case 'PENDING': return 'pending';
            default: return '';
        }
    };

    const calculateDuration = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    };

    return (
        <Layout>
            <div className="time-off-management">
                <div className="time-off-header">
                    <h1>Time Off Management</h1>
                    <p>Request and manage time off from work</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <div className="tabs-header">
                        <button
                            className={`tab-button ${activeTab === 'my-requests' ? 'active' : ''}`}
                            onClick={() => setActiveTab('my-requests')}
                        >
                            My Requests
                        </button>
                        {isEmployee && (
                            <button
                                className={`tab-button ${activeTab === 'new-request' ? 'active' : ''}`}
                                onClick={() => setActiveTab('new-request')}
                            >
                                New Request
                            </button>
                        )}
                        {isAdmin && (
                            <button
                                className={`tab-button ${activeTab === 'approve-requests' ? 'active' : ''}`}
                                onClick={() => setActiveTab('approve-requests')}
                            >
                                Approve Requests ({pendingRequests.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'my-requests' && (
                        <div className="my-requests-section">
                            <div className="section-header">
                                <h3>My Time Off Requests</h3>
                                <p>View and manage your time off requests</p>
                            </div>

                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <p>Loading requests...</p>
                                </div>
                            ) : timeOffRequests.length === 0 ? (
                                <div className="empty-state">
                                    <p>No time off requests found</p>
                                    {isEmployee && (
                                        <button
                                            className="create-first-btn"
                                            onClick={() => setActiveTab('new-request')}
                                        >
                                            Create Your First Request
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="requests-list">
                                    {timeOffRequests.map((request) => (
                                        <div key={request.id} className="request-card">
                                            <div className="request-header">
                                                <div className="request-dates">
                                                    <span className="date-range">
                                                        {formatDateTime(request.startDateTime)} - {formatDateTime(request.endDateTime)}
                                                    </span>
                                                    <span className="duration">
                                                        ({calculateDuration(request.startDateTime, request.endDateTime)})
                                                    </span>
                                                </div>
                                                <span className={`status-badge ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            {request.reason && (
                                                <div className="request-reason">
                                                    <strong>Reason:</strong> {request.reason}
                                                </div>
                                            )}

                                            {request.approvalNotes && (
                                                <div className="approval-notes">
                                                    <strong>Admin Notes:</strong> {request.approvalNotes}
                                                </div>
                                            )}

                                            <div className="request-footer">
                                                <span className="created-date">
                                                    Submitted: {request.createdAt ? formatDateTime(request.createdAt) : 'N/A'}
                                                </span>
                                                {request.status === 'PENDING' && (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteRequest(request.id!)}
                                                        disabled={submitting}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'new-request' && isEmployee && (
                        <div className="new-request-section">
                            <div className="section-header">
                                <h3>Request Time Off</h3>
                                <p>Submit a new time off request</p>
                            </div>

                            <form onSubmit={handleSubmitNewRequest} className="time-off-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="startDateTime">Start Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            id="startDateTime"
                                            value={newRequest.startDateTime}
                                            onChange={(e) => setNewRequest(prev => ({ ...prev, startDateTime: e.target.value }))}
                                            required
                                            min={new Date().toISOString().slice(0, 16)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="endDateTime">End Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            id="endDateTime"
                                            value={newRequest.endDateTime}
                                            onChange={(e) => setNewRequest(prev => ({ ...prev, endDateTime: e.target.value }))}
                                            required
                                            min={newRequest.startDateTime || new Date().toISOString().slice(0, 16)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="reason">Reason (Optional)</label>
                                    <textarea
                                        id="reason"
                                        value={newRequest.reason}
                                        onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                                        placeholder="Enter reason for time off..."
                                        className="form-textarea"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="submit-btn"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default TimeOffManagement;
