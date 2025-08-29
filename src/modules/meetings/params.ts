// modules/agents/params.ts
import { createSearchParamsCache, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { DEFAULT_PAGE } from "@/constants";
import { MeetingStatus } from "./types";

export const filtersSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true}),
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus)),
  agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true}),
};

export const filtersSearchParamsCache = createSearchParamsCache(filtersSearchParams);

// Add this function
export const loadSearchParams = async (searchParams: any) => {
  const parsed = filtersSearchParamsCache.parse(searchParams);
  return {
    search: parsed.search,
    page: parsed.page,
    status: parsed.status,
    agentId: parsed.agentId,
  };
};
