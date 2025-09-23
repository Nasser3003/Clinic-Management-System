import React, { useState } from 'react';
import '../../css/prescriptionsTab.css';

interface Prescription {
    id: string;
    doctorName: string;
    dateWritten: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    duration: string;
    frequency: string;
    status: 'active' | 'expired' | 'discontinued';
    documents?: Document[];
}

interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
    size: string;
}

const PrescriptionsTab: React.FC = () => {
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [showDocuments, setShowDocuments] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Mock data - replace with actual API call
    const prescriptions: Prescription[] = [
        {
            id: '1',
            doctorName: 'Dr. Sarah Johnson',
            dateWritten: '2024-01-15',
            medicationName: 'Lisinopril',
            dosage: '10mg',
            instructions: 'Take once daily in the morning with or without food',
            duration: '30 days',
            frequency: 'Once daily',
            status: 'active',
            documents: [
                { id: '1', name: 'Prescription_Lisinopril.pdf', type: 'PDF', url: '#', size: '125 KB' }
            ]
        },
        {
            id: '2',
            doctorName: 'Dr. Michael Chen',
            dateWritten: '2023-11-22',
            medicationName: 'Metformin',
            dosage: '500mg',
            instructions: 'Take twice daily with meals',
            duration: '90 days',
            frequency: 'Twice daily',
            status: 'active',
            documents: [
                { id: '2', name: 'Prescription_Metformin.pdf', type: 'PDF', url: '#', size: '110 KB' },
                { id: '3', name: 'Medication_Guide.pdf', type: 'PDF', url: '#', size: '890 KB' }
            ]
        },
        {
            id: '3',
            doctorName: 'Dr. Emily Rodriguez',
            dateWritten: '2023-09-10',
            medicationName: 'Ibuprofen',
            dosage: '400mg',
            instructions: 'Take as needed for pain, maximum 3 times daily',
            duration: '7 days',
            frequency: 'As needed',
            status: 'expired',
            documents: [
                { id: '4', name: 'Prescription_Ibuprofen.pdf', type: 'PDF', url: '#', size: '95 KB' }
            ]
        },
        {
            id: '4',
            doctorName: 'Dr. Sarah Johnson',
            dateWritten: '2023-08-05',
            medicationName: 'Amoxicillin',
            dosage: '250mg',
            instructions: 'Take three times daily for 10 days',
            duration: '10 days',
            frequency: 'Three times daily',
            status: 'discontinued',
            documents: []
        }
    ];

    const handlePrescriptionClick = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setShowDocuments(false);
    };

    const handleCloseModal = () => {
        setSelectedPrescription(null);
        setShowDocuments(false);
    };

    const handleViewDocuments = () => {
        setShowDocuments(!showDocuments);
    };

    const handleDocumentClick = (document: Document) => {
        // In a real app, this would open/download the document
        window.open(document.url, '_blank');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="status-badge status-active">Active</span>;
            case 'expired':
                return <span className="status-badge status-expired">Expired</span>;
            case 'discontinued':
                return <span className="status-badge status-discontinued">Discontinued</span>;
            default:
                return null;
        }
    };

    const filteredPrescriptions = prescriptions.filter(prescription => {
        if (filterStatus === 'all') return true;
        return prescription.status === filterStatus;
    });

    return (
        <div className="prescriptions-tab">
            <div className="tab-header">
                <h2 className="tab-title">Prescriptions</h2>
                <div className="filter-controls">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="status-filter"
                    >
                        <option value="all">All Prescriptions</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="discontinued">Discontinued</option>
                    </select>
                </div>
            </div>

            <div className="prescriptions-list">
                {filteredPrescriptions.map((prescription) => (
                    <div
                        key={prescription.id}
                        className="prescription-item"
                        onClick={() => handlePrescriptionClick(prescription)}
                    >
                        <div className="prescription-header">
                            <div className="prescription-main-info">
                                <div className="medication-info">
                                    <h3 className="medication-name">{prescription.medicationName}</h3>
                                    <span className="dosage">{prescription.dosage}</span>
                                </div>
                                {getStatusBadge(prescription.status)}
                            </div>
                            <div className="prescription-meta">
                                <span className="doctor-name">{prescription.doctorName}</span>
                                <span className="date-written">{formatDate(prescription.dateWritten)}</span>
                            </div>
                        </div>

                        <div className="prescription-preview">
                            <p className="instructions-preview">{prescription.instructions}</p>
                            <div className="prescription-details">
                                <span className="quantity">Duration: {prescription.duration}</span>
                                <span className="refills">Frequency: {prescription.frequency}</span>
                            </div>
                        </div>

                        <div className="prescription-footer">
                            {prescription.documents && prescription.documents.length > 0 && (
                                <div className="document-indicator">
                                    <svg className="document-icon" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{prescription.documents.length} document{prescription.documents.length > 1 ? 's' : ''}</span>
                                </div>
                            )}
                            <div className="expand-action">
                                <svg className="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPrescriptions.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>No Prescriptions Found</h3>
                    <p>
                        {filterStatus === 'all'
                            ? 'Your prescriptions will appear here when they are written by your doctors.'
                            : `No ${filterStatus} prescriptions found. Try changing the filter.`
                        }
                    </p>
                </div>
            )}

            {selectedPrescription && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <h3 className="modal-title">{selectedPrescription.medicationName}</h3>
                                <div className="modal-meta">
                                    <span className="modal-doctor">{selectedPrescription.doctorName}</span>
                                    <span className="modal-date">{formatDate(selectedPrescription.dateWritten)}</span>
                                    {getStatusBadge(selectedPrescription.status)}
                                </div>
                            </div>
                            <button className="close-button" onClick={handleCloseModal}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="prescription-details-section">
                                <h4>Prescription Details</h4>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Medication</span>
                                        <span className="detail-value">{selectedPrescription.medicationName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Dosage</span>
                                        <span className="detail-value">{selectedPrescription.dosage}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Duration</span>
                                        <span className="detail-value">{selectedPrescription.duration}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Frequency</span>
                                        <span className="detail-value">{selectedPrescription.frequency}</span>
                                    </div>
                                </div>

                                <div className="instructions-section">
                                    <h5>Instructions</h5>
                                    <p>{selectedPrescription.instructions}</p>
                                </div>
                            </div>

                            {selectedPrescription.documents && selectedPrescription.documents.length > 0 && (
                                <div className="documents-section">
                                    <div className="documents-header">
                                        <h4>Related Documents</h4>
                                        <button
                                            className="toggle-documents-btn"
                                            onClick={handleViewDocuments}
                                        >
                                            {showDocuments ? 'Hide' : 'Show'} Documents
                                        </button>
                                    </div>

                                    {showDocuments && (
                                        <div className="documents-list">
                                            {selectedPrescription.documents.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="document-item"
                                                    onClick={() => handleDocumentClick(doc)}
                                                >
                                                    <div className="document-info">
                                                        <svg className="file-icon" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                        </svg>
                                                        <div className="document-details">
                                                            <span className="document-name">{doc.name}</span>
                                                            <span className="document-meta">{doc.type} • {doc.size}</span>
                                                        </div>
                                                    </div>
                                                    <svg className="download-icon" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionsTab;