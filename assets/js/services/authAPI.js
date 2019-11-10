import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Deconnexion (Suppresion du token du local Storage et sur Axios)
 */
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
      // Je stocke le token dans mon localStorage
      window.localStorage.setItem("authToken", token);

      //on previent Axios qu'on a maintenant un header par defaut sur toutes nos futures requetes HTTP
      setAxiosToken(token);
    });
}

/**
 * Positionne le token sur Axios
 * @param {string} token  le token
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du rechargement de la page
 */
function setup() {
  // 1. Voir si on a le token ?
  const token = window.localStorage.getItem("authToken");
  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
  // 1. Voir si on a le token ?
  const token = window.localStorage.getItem("authToken");
  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated
};
