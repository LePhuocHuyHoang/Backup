import axios from "axios";

import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Keycloak from "keycloak-js";
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthContext = createContext();
function AuthProvider({ children }) {
  const [kc, setKc] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const initOptions = {
      url: "http://localhost:8080",
      realm: "beebook",
      clientId: "beebook-client",
    };

    const keycloakInstance = new Keycloak(initOptions);

    keycloakInstance
      .init({
        onLoad: "check-sso",
        checkLoginIframe: true,
        pkceMethod: "S256",
      })
      .then((auth) => {
        if (!auth) {
          console.log("Authenticated: false");
        } else {
          console.info("Authenticated");
          console.log("auth", auth);
          console.log("Keycloak", keycloakInstance);
          console.log("Access Token", keycloakInstance.token);

          axios.create({}).defaults.headers.common["Authorization"] =
            `Bearer ${keycloakInstance.token}`;
          localStorage.setItem("token", keycloakInstance.token);
          setToken(keycloakInstance.token);
          keycloakInstance.redirectUri = window.location.origin + "/";
          keycloakInstance.onTokenExpired = () => {
            console.log("token expired");
          };
        }
        setKc(keycloakInstance);
      });
  }, []); // Empty dependency array ensures that this effect runs only once, like componentDidMount

  const handleLogin = () => {
    kc.login();
  };

  // const handleRegister = () => {
  //     kc.register();
  // };

  const handleLogout = () => {
    console.log("hit logout");
    setToken(null);
    localStorage.removeItem("token");
    kc.logout();
  };
  const handleGetProfile = () => {
    axios
      .get("http://localhost:8098/user/getProfile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("Profile", res.data);
        setUserProfile(res.data);
      });
  };
  useEffect(() => {
    handleGetProfile();
  }, [token]);
  const value = {
    token,
    setToken,
    handleLogin,
    handleLogout,
    userProfile,
    handleGetProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
