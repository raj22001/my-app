"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowersInfo } from "@/lib/types";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: String;
  initialState: FollowersInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowersInfo>(queryKey);

      queryClient.setQueryData<FollowersInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return  { previousState };
    },
    onError(error, variables, context) {
        queryClient.setQueryData(queryKey , context?.previousState )
        console.error(error)
        toast({
            variant:"destructive",
            description:"Something went wrong. Please try again."
        })
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "unfollow" : "Follow"}
    </Button>
  );
}