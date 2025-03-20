import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

const UserProfileContext = createContext();

export default function UserProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfileData = useCallback(() => {
    setIsLoading(true);
    const url = import.meta.env.VITE_URL_BASE + "/users/profile";
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
          throw new Error("Failed to fetch user profile");
        }
        return r.json();
      })
      .then(data => setUserProfile(data))
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchUserProfileData();
  }, [fetchUserProfileData]);

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        isLoading,
        error,
        refreshUserProfile: fetchUserProfileData,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

UserProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProfileContext };
