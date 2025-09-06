"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";
import { Suspense } from "react";

const MeetingsList = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  const { data, error } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ 
      page: filters.page,
      pageSize: filters.pageSize,
      search: filters.search,
      agentId: filters.agentId,
      status: filters.status
    })
  );

  // Handle error state
  if (error) {
    console.error("Meetings query error:", error);
    return (
      <ErrorState
        title="Error Loading Meetings"
        description="Failed to load meetings. Please try again."
      />
    );
  }

  // Handle empty state
  if (data.items.length === 0) {
    return (
      <EmptyState
        title="Create your first Meeting"
        description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time."
      />
    );
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};

export const MeetingsView = () => {
  return (
    <Suspense
      fallback={
        <LoadingState
          title="Loading Meetings"
          description="Please wait while we fetch your meetings."
        />
      }
    >
      <MeetingsList />
    </Suspense>
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
  );
};