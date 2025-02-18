import { useCallback, useEffect, useState } from "react";

export default function useUsersDataProvider() {
  const [usersData, setUsersData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsersData = useCallback(() => {
    setIsLoading(true);
    const url = import.meta.env.VITE_URL_BASE + "users/all";
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
          throw new Error("Server error");
        }

        return r.json();
      })
      .then(data => setUsersData(data))
      .catch(e => {
        console.log("Error fetching all property users data", e), setError(e);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  return {
    usersData,
    isLoading,
    error,
    refreshUsersData: fetchUsersData,
  };
}
