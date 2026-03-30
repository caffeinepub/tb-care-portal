import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";

actor {
  type Patient = {
    name : Text;
    age : Nat;
    drugName : Text;
    frequency : Text;
  };

  type QuestionnaireResponse = {
    patientName : Text;
    missedDose : Bool;
    sideEffects : Text;
  };

  // Comprehensive KAP Questionnaire Response
  type KAPResponse = {
    // Patient Info
    patientName : Text;
    age : Text;
    gender : Text;
    educationLevel : Text;

    // Symptom Screening
    coughDuration : Text;       // e.g. "<2weeks", "2-4weeks", ">4weeks"
    hasFever : Bool;
    hasNightSweats : Bool;
    hasWeightLoss : Bool;
    hasHemoptysis : Bool;
    otherSymptoms : Text;

    // Knowledge Assessment
    knowsTBTransmission : Text;   // "airborne","contact","water","dontknow"
    knowsTBSymptoms : Bool;
    knowsTreatmentDuration : Text; // "<3months","6months","1year","dontknow"
    believesTBCurable : Text;      // "yes","no","unsure"
    knowledgeScore : Nat;          // computed 0-4

    // Attitudes
    feelsStigmatized : Text;       // "yes","no","sometimes"
    willingToDisclose : Text;      // "yes","no","selectedpeople"
    communityPerception : Text;    // "supportive","neutral","stigmatizing"
    attitudeScore : Nat;           // computed 0-3

    // Treatment Adherence / Practices
    missedDose : Bool;
    missedDoseReason : Text;
    dotCompliance : Text;          // "always","sometimes","never"
    sideEffects : Text;
    adherenceScore : Nat;          // computed 0-3

    overallScore : Nat;            // total out of 10
  };

  module Patient {
    public func compare(p1 : Patient, p2 : Patient) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  let patients = Map.empty<Text, Patient>();
  let responses = List.empty<QuestionnaireResponse>();
  let kapResponses = List.empty<KAPResponse>();

  public shared ({ caller }) func addPatient(name : Text, age : Nat, drugName : Text, frequency : Text) : async () {
    let patient : Patient = { name; age; drugName; frequency };
    patients.add(name, patient);
  };

  public shared ({ caller }) func addResponse(patientName : Text, missedDose : Bool, sideEffects : Text) : async () {
    let response : QuestionnaireResponse = { patientName; missedDose; sideEffects };
    responses.add(response);
  };

  public shared ({ caller }) func addKAPResponse(
    patientName : Text, age : Text, gender : Text, educationLevel : Text,
    coughDuration : Text, hasFever : Bool, hasNightSweats : Bool, hasWeightLoss : Bool,
    hasHemoptysis : Bool, otherSymptoms : Text,
    knowsTBTransmission : Text, knowsTBSymptoms : Bool, knowsTreatmentDuration : Text,
    believesTBCurable : Text, knowledgeScore : Nat,
    feelsStigmatized : Text, willingToDisclose : Text, communityPerception : Text, attitudeScore : Nat,
    missedDose : Bool, missedDoseReason : Text, dotCompliance : Text, sideEffects : Text, adherenceScore : Nat,
    overallScore : Nat
  ) : async () {
    let r : KAPResponse = {
      patientName; age; gender; educationLevel;
      coughDuration; hasFever; hasNightSweats; hasWeightLoss; hasHemoptysis; otherSymptoms;
      knowsTBTransmission; knowsTBSymptoms; knowsTreatmentDuration; believesTBCurable; knowledgeScore;
      feelsStigmatized; willingToDisclose; communityPerception; attitudeScore;
      missedDose; missedDoseReason; dotCompliance; sideEffects; adherenceScore;
      overallScore;
    };
    kapResponses.add(r);
  };

  public query ({ caller }) func getPatients() : async [Patient] {
    patients.values().toArray().sort();
  };

  public query ({ caller }) func getResponses() : async [QuestionnaireResponse] {
    responses.toArray();
  };

  public query ({ caller }) func getKAPResponses() : async [KAPResponse] {
    kapResponses.toArray();
  };
};
