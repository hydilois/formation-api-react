// Les imports importants
import React from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
//import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";

/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you require will output into a single css file (app.css in this case)
require("../css/app.css");

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log("Hello World");

const App = () => {
  return (
    <HashRouter>
      <NavBar />
      <main className="container pt-5">
        <Switch>
          <Route path="/invoices" component={InvoicesPage}></Route>
          <Route path="/customers" component={CustomersPage}></Route>
          <Route path="/" component={HomePage}></Route>
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
