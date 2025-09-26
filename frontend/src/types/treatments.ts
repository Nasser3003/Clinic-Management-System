// Updated types/treatments.ts
export interface Prescription {
    id?: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    treatmentId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TreatmentManagement {
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    installmentPeriodInMonths: number;
    prescriptions?: Prescription[]; // Added prescriptions to TreatmentManagement
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
    prescriptions: Prescription[]; // Changed from string[] to Prescription[]
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