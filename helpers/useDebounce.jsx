import { useEffect, useState } from "react";

export default function useDebounce(searchQuery, delay = 500) {
  const [debounceValue, setDebounceValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(searchQuery);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  return debounceValue;
}
