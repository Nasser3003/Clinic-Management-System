import React, { useState } from 'react';
import './css/visitNotesTab.css';

interface VisitNote {
    id: string;
    doctorName: string;
    dateWritten: string;
    shortNote: string;
    fullNote: string;
    documents?: Document[];
}

interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
    size: string;
}

const VisitNotesTab: React.FC = () => {
    const [selectedNote, setSelectedNote] = useState<VisitNote | null>(null);
    const [showDocuments, setShowDocuments] = useState(false);

    // Mock data - replace with actual API call
    const visitNotes: VisitNote[] = [
        {
            id: '1',
            doctorName: 'Dr. Sarah Johnson',
            dateWritten: '2024-01-15',
            shortNote: 'Annual check-up, blood pressure monitoring...',
            fullNote: 'Patient presented for annual check-up. Blood pressure elevated at 145/90. Discussed lifestyle modifications including diet and exercise. Recommended monitoring at home. Patient reports occasional headaches. Physical examination normal. Lab work ordered including CBC and lipid panel. Follow-up in 3 months.',
            documents: [
                { id: '1', name: 'Lab_Results_Jan2024.pdf', type: 'PDF', url: '#', size: '245 KB' },
                { id: '2', name: 'EKG_Reading.pdf', type: 'PDF', url: '#', size: '180 KB' }
            ]
        },
        {
            id: '2',
            doctorName: 'Dr. Michael Chen',
            dateWritten: '2023-11-22',
            shortNote: 'Follow-up consultation for chronic condition...',
            fullNote: 'Follow-up visit for hypertension management. Patient compliant with medication regimen. Blood pressure improved to 135/85. Reports no side effects from current medications. Continue current treatment plan. Discussed importance of regular monitoring.',
            documents: [
                { id: '3', name: 'Blood_Pressure_Log.pdf', type: 'PDF', url: '#', size: '156 KB' }
            ]
        },
        {
            id: '3',
            doctorName: 'Dr. Emily Rodriguez',
            dateWritten: '2023-09-10',
            shortNote: 'Consultation for knee pain and mobility issues...',
            fullNote: 'Patient presents with right knee pain, duration 3 weeks. Pain worse in mornings and after prolonged sitting. Physical examination reveals mild swelling and reduced range of motion. X-ray ordered to rule out structural damage. Prescribed anti-inflammatory medication. Physical therapy recommended.',
            documents: [
                { id: '4', name: 'Knee_Xray_Sept2023.pdf', type: 'PDF', url: '#', size: '2.1 MB' },
                { id: '5', name: 'PT_Referral.pdf', type: 'PDF', url: '#', size: '95 KB' }
            ]
        }
    ];

    const handleNoteClick = (note: VisitNote) => {
        setSelectedNote(note);
        setShowDocuments(false);
    };

    const handleCloseModal = () => {
        setSelectedNote(null);
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

    return (
        <div className="visit-notes-tab">
            <h2 className="tab-title">Visit Notes</h2>
            
            <div className="notes-list">
                {visitNotes.map((note) => (
                    <div
                        key={note.id}
                        className="note-item"
                        onClick={() => handleNoteClick(note)}
                    >
                        <div className="note-header">
                            <div className="doctor-info">
                                <h3 className="doctor-name">{note.doctorName}</h3>
                                <span className="visit-date">{formatDate(note.dateWritten)}</span>
                            </div>
                            <div className="note-actions">
                                <svg className="expand-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="note-preview">
                            <p>{note.shortNote}</p>
                        </div>
                        {note.documents && note.documents.length > 0 && (
                            <div className="document-indicator">
                                <svg className="document-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                                <span>{note.documents.length} document{note.documents.length > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {visitNotes.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3>No Visit Notes</h3>
                    <p>Your visit notes will appear here after your appointments.</p>
                </div>
            )}

            {selectedNote && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <h3 className="modal-title">{selectedNote.doctorName}</h3>
                                <span className="modal-date">{formatDate(selectedNote.dateWritten)}</span>
                            </div>
                            <button className="close-button" onClick={handleCloseModal}>
                                <svg viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="full-note">
                                <h4>Visit Notes</h4>
                                <p>{selectedNote.fullNote}</p>
                            </div>

                            {selectedNote.documents && selectedNote.documents.length > 0 && (
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
                                            {selectedNote.documents.map((doc) => (
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

export default VisitNotesTab;