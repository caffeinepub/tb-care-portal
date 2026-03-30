/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const Patient = IDL.Record({
  'age' : IDL.Nat,
  'drugName' : IDL.Text,
  'name' : IDL.Text,
  'frequency' : IDL.Text,
});
export const QuestionnaireResponse = IDL.Record({
  'patientName' : IDL.Text,
  'sideEffects' : IDL.Text,
  'missedDose' : IDL.Bool,
});
export const KAPResponse = IDL.Record({
  'patientName' : IDL.Text,
  'age' : IDL.Text,
  'gender' : IDL.Text,
  'educationLevel' : IDL.Text,
  'coughDuration' : IDL.Text,
  'hasFever' : IDL.Bool,
  'hasNightSweats' : IDL.Bool,
  'hasWeightLoss' : IDL.Bool,
  'hasHemoptysis' : IDL.Bool,
  'otherSymptoms' : IDL.Text,
  'knowsTBTransmission' : IDL.Text,
  'knowsTBSymptoms' : IDL.Bool,
  'knowsTreatmentDuration' : IDL.Text,
  'believesTBCurable' : IDL.Text,
  'knowledgeScore' : IDL.Nat,
  'feelsStigmatized' : IDL.Text,
  'willingToDisclose' : IDL.Text,
  'communityPerception' : IDL.Text,
  'attitudeScore' : IDL.Nat,
  'missedDose' : IDL.Bool,
  'missedDoseReason' : IDL.Text,
  'dotCompliance' : IDL.Text,
  'sideEffects' : IDL.Text,
  'adherenceScore' : IDL.Nat,
  'overallScore' : IDL.Nat,
});

export const idlService = IDL.Service({
  'addPatient' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text, IDL.Text], [], []),
  'addResponse' : IDL.Func([IDL.Text, IDL.Bool, IDL.Text], [], []),
  'addKAPResponse' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Bool, IDL.Bool, IDL.Bool, IDL.Text, IDL.Text, IDL.Bool, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Bool, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat], [], []),
  'getPatients' : IDL.Func([], [IDL.Vec(Patient)], ['query']),
  'getResponses' : IDL.Func([], [IDL.Vec(QuestionnaireResponse)], ['query']),
  'getKAPResponses' : IDL.Func([], [IDL.Vec(KAPResponse)], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Patient = IDL.Record({
    'age' : IDL.Nat,
    'drugName' : IDL.Text,
    'name' : IDL.Text,
    'frequency' : IDL.Text,
  });
  const QuestionnaireResponse = IDL.Record({
    'patientName' : IDL.Text,
    'sideEffects' : IDL.Text,
    'missedDose' : IDL.Bool,
  });
  const KAPResponse = IDL.Record({
    'patientName' : IDL.Text,
    'age' : IDL.Text,
    'gender' : IDL.Text,
    'educationLevel' : IDL.Text,
    'coughDuration' : IDL.Text,
    'hasFever' : IDL.Bool,
    'hasNightSweats' : IDL.Bool,
    'hasWeightLoss' : IDL.Bool,
    'hasHemoptysis' : IDL.Bool,
    'otherSymptoms' : IDL.Text,
    'knowsTBTransmission' : IDL.Text,
    'knowsTBSymptoms' : IDL.Bool,
    'knowsTreatmentDuration' : IDL.Text,
    'believesTBCurable' : IDL.Text,
    'knowledgeScore' : IDL.Nat,
    'feelsStigmatized' : IDL.Text,
    'willingToDisclose' : IDL.Text,
    'communityPerception' : IDL.Text,
    'attitudeScore' : IDL.Nat,
    'missedDose' : IDL.Bool,
    'missedDoseReason' : IDL.Text,
    'dotCompliance' : IDL.Text,
    'sideEffects' : IDL.Text,
    'adherenceScore' : IDL.Nat,
    'overallScore' : IDL.Nat,
  });
  
  return IDL.Service({
    'addPatient' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text, IDL.Text], [], []),
    'addResponse' : IDL.Func([IDL.Text, IDL.Bool, IDL.Text], [], []),
    'addKAPResponse' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool, IDL.Bool, IDL.Bool, IDL.Bool, IDL.Text, IDL.Text, IDL.Bool, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Bool, IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat], [], []),
    'getPatients' : IDL.Func([], [IDL.Vec(Patient)], ['query']),
    'getResponses' : IDL.Func([], [IDL.Vec(QuestionnaireResponse)], ['query']),
    'getKAPResponses' : IDL.Func([], [IDL.Vec(KAPResponse)], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
