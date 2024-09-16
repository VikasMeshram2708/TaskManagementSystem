import { useEffect, useState } from "react";

export default function useDebounce(searchQuery: string, delay = 500) {
  const [debounceQuery, setDebounceQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceQuery(searchQuery);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);
  return debounceQuery;
}
