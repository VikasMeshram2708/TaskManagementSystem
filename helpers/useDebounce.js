import { useEffect, useState } from "react";

export default function useDebounce(searchQuery, delay = 500) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchQuery, delay]);

  return debouncedQuery;
}
