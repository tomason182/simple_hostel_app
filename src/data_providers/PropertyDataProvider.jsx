import { useState, useCallback, useEffect } from "react";

export default function usePropertyDataProvider() {
  const [propertyData, setPropertyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropertyData = useCallback(() => {
    setIsLoading(true); // Reset loading state before each fetch
    const url = import.meta.env.VITE_URL_BASE + "/properties";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(r => {
        if (r.status >= 400) {
          throw new Error("Server Error");
        }

        return r.json();
      })
      .then(data => setPropertyData(data))
      .catch(e => {
        console.error("Error fetching property data", e);
        setError(e);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  return {
    propertyData,
    isLoading,
    error,
    refreshPropertyData: fetchPropertyData,
  };
}
