import { useState, useCallback, useEffect } from "react";

export function useGetTodayReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayReservations = useCallback(() => {
    setLoading(true);
    const url = import.meta.env.VITE_URL_BASE + "/reservations/find/today";
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
      .then(data => setReservations(data))
      .catch(e => {
        console.error("Error fetching data", e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTodayReservations();
  }, [fetchTodayReservations]);

  return {
    todayReservations: reservations,
    loadingTodayReservations: loading,
    error,
    refreshTodayReservationsData: fetchTodayReservations,
  };
}

export function useGetLatestReservations() {
  const [latestReservations, setLatestReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestReservation = useCallback(() => {
    setLoading(true);
    const url = import.meta.env.VITE_URL_BASE + "/reservations/find/latest";
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
      .then(data => setLatestReservations(data))
      .catch(e => {
        console.error("Error fetching data", e);
        setError(e);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchLatestReservation();
  }, [fetchLatestReservation]);

  return {
    latestReservations,
    loadingLatestReservation: loading,
    errorLatestReservations: error,
    refreshLatestReservationsData: fetchLatestReservation,
  };
}
