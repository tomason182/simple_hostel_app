import { useState, useCallback, useEffect } from "react";
import { dateFormatHelper } from "../utils/dateFormatHelper";

export function useFetchRatesAndAvailabilityByDateRange(from, to) {
  const [ratesAndAvailability, setRatesAnAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fromDate = dateFormatHelper(from);
  const toDate = dateFormatHelper(to);

  const fetchRatesAndAvailability = useCallback(() => {
    setLoading(true);
    const url =
      import.meta.env.VITE_URL_BASE +
      "/rates-and-availability/find/" +
      fromDate +
      "-" +
      toDate;
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => setRatesAnAvailability(data))
      .catch(e => {
        console.error(e.message);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchRatesAndAvailability();
  }, [fetchRatesAndAvailability]);

  return {
    ratesAndAvailability,
    loadingRatesAndAvailability: loading,
    errorRatesAndAvailability: error,
    refreshRatesAndAvailability: fetchRatesAndAvailability,
  };
}
