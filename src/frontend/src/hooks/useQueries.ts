import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetPatients() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetResponses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["responses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getResponses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetKAPResponses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["kapResponses"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getKAPResponses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      age: number;
      drugName: string;
      frequency: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addPatient(
        data.name,
        BigInt(data.age),
        data.drugName,
        data.frequency,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useAddResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      patientName: string;
      missedDose: boolean;
      sideEffects: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addResponse(
        data.patientName,
        data.missedDose,
        data.sideEffects,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
    },
  });
}

export function useAddKAPResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
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
      knowledgeScore: number;
      feelsStigmatized: string;
      willingToDisclose: string;
      communityPerception: string;
      attitudeScore: number;
      missedDose: boolean;
      missedDoseReason: string;
      dotCompliance: string;
      sideEffects: string;
      adherenceScore: number;
      overallScore: number;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).addKAPResponse(
        data.patientName,
        data.age,
        data.gender,
        data.educationLevel,
        data.coughDuration,
        data.hasFever,
        data.hasNightSweats,
        data.hasWeightLoss,
        data.hasHemoptysis,
        data.otherSymptoms,
        data.knowsTBTransmission,
        data.knowsTBSymptoms,
        data.knowsTreatmentDuration,
        data.believesTBCurable,
        BigInt(data.knowledgeScore),
        data.feelsStigmatized,
        data.willingToDisclose,
        data.communityPerception,
        BigInt(data.attitudeScore),
        data.missedDose,
        data.missedDoseReason,
        data.dotCompliance,
        data.sideEffects,
        BigInt(data.adherenceScore),
        BigInt(data.overallScore),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kapResponses"] });
    },
  });
}

export function useIsCurrentUserAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await (actor as any).isAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

type InviteCode = { code: string; used: boolean };

export function useGetInviteCodes() {
  const { actor, isFetching } = useActor();
  return useQuery<InviteCode[]>({
    queryKey: ["inviteCodes"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as any).getInviteCodes();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<string>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return await (actor as any).generateInviteCode();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inviteCodes"] });
    },
  });
}
