import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

const RoomTypeContext = createContext();

export default function RoomTypeDataProvider({ children }) {
  const [roomTypes, setRoomTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoomTypesData = useCallback(() => {
    setIsLoading(true);
    const url = import.meta.env.VITE_URL_BASE + "/room-types";
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
          console.error(
            `Server Error. Status: ${r.status} - Error: ${r.message}`
          );
          throw new Error("Server error");
        }

        return r.json();
      })
      .then(data => setRoomTypesData(data))
      .catch(e => {
        console.error("Error fetching room types data", e);
        setError(e);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchRoomTypesData();
  }, [fetchRoomTypesData]);

  return (
    <RoomTypeContext.Provider
      value={{
        roomTypes,
        isLoading,
        error,
        refreshRoomTypeData: fetchRoomTypesData,
      }}
    >
      {children}
    </RoomTypeContext.Provider>
  );
}

RoomTypeDataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RoomTypeContext };
