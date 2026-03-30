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
