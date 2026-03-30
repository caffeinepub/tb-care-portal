/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface Patient {
  'age' : bigint,
  'drugName' : string,
  'name' : string,
  'frequency' : string,
}
export interface QuestionnaireResponse {
  'patientName' : string,
  'sideEffects' : string,
  'missedDose' : boolean,
}
export interface KAPResponse {
  'patientName' : string,
  'age' : string,
  'gender' : string,
  'educationLevel' : string,
  'coughDuration' : string,
  'hasFever' : boolean,
  'hasNightSweats' : boolean,
  'hasWeightLoss' : boolean,
  'hasHemoptysis' : boolean,
  'otherSymptoms' : string,
  'knowsTBTransmission' : string,
  'knowsTBSymptoms' : boolean,
  'knowsTreatmentDuration' : string,
  'believesTBCurable' : string,
  'knowledgeScore' : bigint,
  'feelsStigmatized' : string,
  'willingToDisclose' : string,
  'communityPerception' : string,
  'attitudeScore' : bigint,
  'missedDose' : boolean,
  'missedDoseReason' : string,
  'dotCompliance' : string,
  'sideEffects' : string,
  'adherenceScore' : bigint,
  'overallScore' : bigint,
}
export interface _SERVICE {
  'addPatient' : ActorMethod<[string, bigint, string, string], undefined>,
  'addResponse' : ActorMethod<[string, boolean, string], undefined>,
  'addKAPResponse' : ActorMethod<[string, string, string, string, string, boolean, boolean, boolean, boolean, string, string, boolean, string, string, bigint, string, string, string, bigint, boolean, string, string, string, bigint, bigint], undefined>,
  'getPatients' : ActorMethod<[], Array<Patient>>,
  'getResponses' : ActorMethod<[], Array<QuestionnaireResponse>>,
  'getKAPResponses' : ActorMethod<[], Array<KAPResponse>>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
