'use client';

import { useState, useEffect } from 'react';

export default function useDynamicContent(endpoint, initialData = null) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isDynamic, setIsDynamic] = useState(false);

  useEffect(() => {
    if (!endpoint || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchDynamicData() {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        
        if (isMounted && json && Object.keys(json).length > 0) {
          setData((prev) => ({ ...prev, ...json }));
          setIsDynamic(true);
        }
      } catch (err) {
        // Silent fallback to initial hardcoded static data
        if (process.env.NODE_ENV === 'development') {
          console.info(`[DynamicContent] Endpoint ${endpoint} using static fallback.`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDynamicData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, isLoading, isDynamic };
}
