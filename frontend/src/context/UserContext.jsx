import { createContext, useContext, useState } from "react";

// Create the context
const UserContext = createContext();

// Create the provider component
export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // null when not logged in

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  return useContext(UserContext);
}