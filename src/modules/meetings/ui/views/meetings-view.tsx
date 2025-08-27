"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

   return (
    <div>
        {JSON.stringify(data)}
    </div>
   );
};

export const MeetingsIdViewLoading = () => {
    return (
        <LoadingState
          title="Loading Meeting"
          description="This may take a few seconds"
        />
    );
};

export const MeetingsIdViewError = () => {
    return (
        <ErrorState
          title="Error Loading Meetings"
          description="Something went wrong"
        />
    )
}