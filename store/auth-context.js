import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  email: "",
  isAuthenticated: false,
  authenticate: (token, email) => {},
  logout: () => {},
});

export default function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [authEmail, setAuthEmail] = useState(null);

  function authenticate(token, email) {
    setAuthToken(token);
    setAuthEmail(email);
  }

  function logout() {
    setAuthToken(null);
    setAuthEmail(null);
  }

  const value = {
    token: authToken,
    email: authEmail,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
