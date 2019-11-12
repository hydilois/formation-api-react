import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersApi from "../services/customersAPI";
import { Link } from "react-router-dom";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  //Permet d'aller recuperer les customers
  const fetchCustomers = async () => {
    try {
      const data = await CustomersApi.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  //Gestion de la suppression d'un client
  const handleDelete = async id => {
    const originalCustomers = [...customers];

    // 1. L'approche Optimiste
    setCustomers(customers.filter(customer => customer.id !== id));

    //2. L'approche Pessimiste
    try {
      await CustomersApi.delete(id);
    } catch (error) {
      setCustomers(originalCustomers);
      console.log(error.response);
    }
    // Deuxieme façon de faire
    // CustomersApi.delete(id)
    //   .then(response => console.log("OK"))
    //   .catch(error => {
    //     setCustomers(originalCustomers);
    //   });
  };

  //Gestion du changement de la page
  const handlePageChange = page => {
    setCurrentPage(page);
  };
  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };
  const itemsPerPage = 10;

  //Filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );
  // const paginatedCustomers =
  //   filteredCustomers.length > itemsPerPage
  //     ? Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
  //     : filteredCustomers;

  return (
    <>
      <div className="mb-5 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>
      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Fatures</th>
            <th className="text-center">Montant Total</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}{" "}
                </a>
              </td>
              <td> {customer.email} </td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} F{" "}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
