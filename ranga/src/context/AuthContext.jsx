import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: "gisubizo@gmail.com",
  password: "629131",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // a real token is either the static admin token or a JWT (has 2 dots)
  const isRealToken = (t) =>
    t === "admin-token-secure-001" || (typeof t === "string" && t.split(".").length === 3);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken && isRealToken(savedToken)) {
        setUser(JSON.parse(savedUser));
      } else {
        // clear fake/demo tokens
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Check admin credentials locally before hitting API
  const checkAdminLogin = (email, password) => {
    return (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        checkAdminLogin,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        isSeller: user?.role === "seller",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
