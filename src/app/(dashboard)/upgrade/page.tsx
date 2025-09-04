import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    UpgradeView,
    UpgradeViewLoading,
    UpgradeViewError
} from "@/modules/premium/ui/views/upgrade-view"
import { auth } from "@/lib/auth";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { useTRPC } from "@/trpc/client";

const Page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session){
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions(),
    )
    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions(),
    )

    return (
        <HydrationBoundary>
            <Suspense fallback={<UpgradeViewLoading />}>
               <ErrorBoundary fallback={<UpgradeViewError />}>
                  <UpgradeView /> 
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;