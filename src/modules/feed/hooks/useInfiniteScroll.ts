"use client";

import { useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = "200px",
}: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node || !hasMore || isLoading) return;

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            onLoadMore();
          }
        },
        { rootMargin }
      );

      observer.current.observe(node);
    },
    [onLoadMore, hasMore, isLoading, rootMargin]
  );

  return { sentinelRef };
}
