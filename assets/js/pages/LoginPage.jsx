import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ onLogin, history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  //Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  //Gest du submit
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError(
        "Aucun compte ne possèdde cette adresse ou alors les informations ne correspondent pas !"
      );
    }
  };
  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit} action="">
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            onChange={handleChange}
            value={credentials.username}
            placeholder="Adresse email de connexion"
            type="email"
            name="username"
            className={"form-control" + (error && " is-invalid")}
            id="username"
          />
          {error && (
            <p className="invalid-feedback">
              Aucun compte ne possèdde cette adresse ou alors les informations
              ne correspondent pas
            </p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="_password">Mot de passe</label>
          <input
            onChange={handleChange}
            value={credentials.password}
            placeholder="Mot de passe"
            name="password"
            id="password"
            type="password"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
