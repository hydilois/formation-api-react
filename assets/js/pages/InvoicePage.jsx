import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import CustomerAPI from "../services/customersAPI";
import axios from "axios";
import InvoiceAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const [customers, setCustomers] = useState([]);

  const [editing, setEditing] = useState(false);

  //Recuperation des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomerAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) {
        setInvoice({ ...invoice, customer: data[0].id });
      }
    } catch (error) {
      history.replace("/invoices");
      //TODO: Flash notification Erreur
    }
  };

  //Recuperation d'une facture
  const fetchInvoice = async id => {
    try {
      const { amount, status, customer } = await InvoiceAPI.find(id);

      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      // TODO: Notification erreur
      history.replace("/invoices");
    }
  };

  //Recuperation de la liste des clients a chaque chargement du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Recuperation de la bonne facture quand l'identifiant de l'URL change
  useEffect(() => {
    if (id !== "new") {
      fetchInvoice(id);
      setEditing(true);
    }
  }, []);

  //Gestion de changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      if (editing) {
        await InvoiceAPI.update(id, invoice);
        // TODO: Flash notification success
      } else {
        await InvoiceAPI.create(invoice);
        // TODO: Flash de notification success
        history.replace("/invoices");
        setErrors({});
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        console.log(apiErrors);

        setErrors(apiErrors);

        // TODO: Flash de notification d'erreur
      }
    }
  };
  return (
    <>
      {(editing && <h1>Modification d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          onChange={handleChange}
          error={errors.customer}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          name="status"
          value={invoice.status}
          onChange={handleChange}
          error={errors.status}
        >
          <option value="SENT">Envoyé</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
