import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import CustomerAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });

  const [editing, setEditing] = useState(false);

  /**
   * Recuperation du customer en fonction de l'identifiant
   *
   * @param {BigInteger} id
   */
  const fetchCustomer = async id => {
    try {
      const { firstName, lastName, email, company } = await CustomerAPI.find(
        id
      );
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      // TODO: Notification flash d'une erreur
      history.replace("/customers");
    }
  };

  //Chargement du customer si besoin au chatgement du composant ou au chargement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);

      fetchCustomer(id);
    }
  }, [id]);

  //Gestion de changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };
  // Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await CustomerAPI.update(id, customer);

        // TODO: Flasd de notification de succès
      } else {
        await CustomerAPI.create(customer);
        // TODO: Flasd de notification de succès
        history.replace("/customers");
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);

        // TODO: Flasd de notification d'erreur
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification d'un client</h1>
      )}
      <form action="" onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse email du client"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
          type="email"
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
