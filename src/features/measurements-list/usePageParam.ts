import { useCallback, useEffect, useState } from "react";
import { parsePageParam } from "./page-param";

const PAGE_PARAM = "page";

function readPageFromUrl() {
  return parsePageParam(
    new URLSearchParams(window.location.search).get(PAGE_PARAM),
  );
}

function writePageToUrl(page: number, mode: "push" | "replace") {
  const url = new URL(window.location.href);
  url.searchParams.set(PAGE_PARAM, String(page));
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

export function usePageParam() {
  const [page, setPage] = useState(readPageFromUrl);

  useEffect(() => {
    const syncFromUrl = () => setPage(readPageFromUrl());
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    writePageToUrl(nextPage, "push");
    setPage(nextPage);
  }, []);

  const replacePage = useCallback((nextPage: number) => {
    writePageToUrl(nextPage, "replace");
    setPage(nextPage);
  }, []);

  return { page, goToPage, replacePage };
}
