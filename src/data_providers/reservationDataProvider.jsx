import { useState, useCallback, useEffect } from "react";
import { dateFormatHelper } from "../utils/dateFormatHelper";

export function useGetTodayReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayReservations = useCallback(() => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const url = import.meta.env.VITE_URL_BASE + "/reservations/find/" + today;
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
    const url = import.meta.env.VITE_URL_BASE + "/reservations/latest";
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

export function useFetchReservationByDateRange(from, to, type = "calendar") {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fromDate = dateFormatHelper(from);
  const toDate = dateFormatHelper(to);

  const fetchReservations = useCallback(() => {
    setIsLoading(true);
    const url =
      import.meta.env.VITE_URL_BASE +
      "/reservations/find-by-range/" +
      fromDate +
      "-" +
      toDate +
      "-" +
      type;
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
      .then(data => {
        if (data.status === "error") {
          setError(data.msg);
          return;
        }

        setReservations(data.msg);
      })
      .catch(e => {
        console.error(e.message);
        setError(e.message);
      })
      .finally(() => setIsLoading(false));
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loadingReservations: isLoading,
    errorReservations: error,
    refreshReservationsData: fetchReservations,
  };
}

export function useFetchReservationById(id) {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url =
      import.meta.env.VITE_URL_BASE + "/reservations/find-by-id/" + id;
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
          throw new Error("Unable to fetch reservation. Server Error");
        }
        return response.json();
      })
      .then(data => {
        if (data.status && data.status === "error") {
          setError(data.msg || "Unknown error");
        }

        setReservation(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return {
    reservation,
    loading,
    error,
  };
}
