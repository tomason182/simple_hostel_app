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
        console.log("Error fetching property data", e);
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

export function useFacilitiesDataProvider() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropertyFacilities = useCallback(() => {
    const url = import.meta.env.VITE_URL_BASE + "/properties";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    setLoading(true);
    setError(null);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to fetch facilities");
        }
        return response.json();
      })
      .then(data => setFacilities(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPropertyFacilities();
  }, [fetchPropertyFacilities]);

  return {
    propertyFacilities: facilities,
    loadingPropertyFacilities: loading,
    errorPropertyFacilities: error,
    refreshPropertyFacilities: fetchPropertyFacilities,
  };
}
