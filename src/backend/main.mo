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

  module Patient {
    public func compare(p1 : Patient, p2 : Patient) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  let patients = Map.empty<Text, Patient>();
  let responses = List.empty<QuestionnaireResponse>();

  public shared ({ caller }) func addPatient(name : Text, age : Nat, drugName : Text, frequency : Text) : async () {
    let patient : Patient = {
      name;
      age;
      drugName;
      frequency;
    };
    patients.add(name, patient);
  };

  public shared ({ caller }) func addResponse(patientName : Text, missedDose : Bool, sideEffects : Text) : async () {
    let response : QuestionnaireResponse = {
      patientName;
      missedDose;
      sideEffects;
    };
    responses.add(response);
  };

  public query ({ caller }) func getPatients() : async [Patient] {
    patients.values().toArray().sort();
  };

  public query ({ caller }) func getResponses() : async [QuestionnaireResponse] {
    responses.toArray();
  };
};
