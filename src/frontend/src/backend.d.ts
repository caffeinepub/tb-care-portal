import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuestionnaireResponse {
    patientName: string;
    sideEffects: string;
    missedDose: boolean;
}
export interface KAPResponse {
    patientName: string;
    age: string;
    gender: string;
    educationLevel: string;
    coughDuration: string;
    hasFever: boolean;
    hasNightSweats: boolean;
    hasWeightLoss: boolean;
    hasHemoptysis: boolean;
    otherSymptoms: string;
    knowsTBTransmission: string;
    knowsTBSymptoms: boolean;
    knowsTreatmentDuration: string;
    believesTBCurable: string;
    knowledgeScore: bigint;
    feelsStigmatized: string;
    willingToDisclose: string;
    communityPerception: string;
    attitudeScore: bigint;
    missedDose: boolean;
    missedDoseReason: string;
    dotCompliance: string;
    sideEffects: string;
    adherenceScore: bigint;
    overallScore: bigint;
}
export interface Patient {
    age: bigint;
    drugName: string;
    name: string;
    frequency: string;
}
export interface backendInterface {
    addPatient(name: string, age: bigint, drugName: string, frequency: string): Promise<void>;
    addResponse(patientName: string, missedDose: boolean, sideEffects: string): Promise<void>;
    addKAPResponse(
        patientName: string, age: string, gender: string, educationLevel: string,
        coughDuration: string, hasFever: boolean, hasNightSweats: boolean, hasWeightLoss: boolean,
        hasHemoptysis: boolean, otherSymptoms: string,
        knowsTBTransmission: string, knowsTBSymptoms: boolean, knowsTreatmentDuration: string,
        believesTBCurable: string, knowledgeScore: bigint,
        feelsStigmatized: string, willingToDisclose: string, communityPerception: string, attitudeScore: bigint,
        missedDose: boolean, missedDoseReason: string, dotCompliance: string, sideEffects: string, adherenceScore: bigint,
        overallScore: bigint
    ): Promise<void>;
    getPatients(): Promise<Array<Patient>>;
    getResponses(): Promise<Array<QuestionnaireResponse>>;
    getKAPResponses(): Promise<Array<KAPResponse>>;
}
