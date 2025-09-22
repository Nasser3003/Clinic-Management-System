export interface TreatmentManagement {
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    installmentPeriodInMonths: number;
}

export interface Treatment {
    id: string;
    doctorName: string;
    patientName: string;
    appointmentId: string;
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    remainingBalance: number;
    installmentPeriodInMonths: number;
    createdAt: string;
    updatedAt: string;
    prescriptions?: string[];
    visitNotes?: string;
}

export interface TreatmentFormData {
    appointmentId: string;
    treatments: TreatmentManagement[];
}

export interface TreatmentFilters {
    patientEmail: string;
    doctorEmail: string;
    paid: string;
    startDate: string;
    endDate: string;
    prescriptionKeyword: string;
    visitNotesKeyword: string;
}