import { deleteSessions } from "../lib/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSIONS } from "./useSessions";

const useDeleteSession = (sessionId) => {
  const queryClient = useQueryClient();
  const { mutate: deleteSession, ...rest } = useMutation({
    mutationFn: () => deleteSessions(sessionId),
    onSuccess: () => {
      queryClient.setQueryData([SESSIONS], (cache) =>
        cache.filter((session) => session._id !== sessionId)
      );
    },
  });

  return { deleteSession, ...rest };
};

export default useDeleteSession;
