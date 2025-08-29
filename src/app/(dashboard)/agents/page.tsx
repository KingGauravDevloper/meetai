import { auth } from "@/lib/auth";
import { filtersSearchParamsCache } from "@/modules/agents/params";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/ui/views/components/agents-list-header";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props { 
  searchParams: Record<string, string | string[] | undefined>
}

const Page = async ({ searchParams }: Props) => {
  // This is the supported server-side usage!
  const filters = filtersSearchParamsCache.parse(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));

  const dehydratedState = dehydrate(queryClient);
  const sanitizedState = JSON.parse(JSON.stringify(dehydratedState));

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={sanitizedState}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}

export default Page;