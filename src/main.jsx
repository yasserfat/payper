import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import "tailwindcss/tailwind.css";
import "./index.css";

import Layout from "./components/Layout";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import LandingPage from "./pages/landing/LandingPage";
import UserCollectData from "./pages/user-collect-data/UserCollectData";
import NewUserLayout from "./components/NewUserLayout";
import LoggedInLayout from "./components/LoggedInLayout";
import Overview from "./pages/overview/Overview";
import Transactions from "./pages/transactions/Transactions";
import TableAllTransactions from "./components/table-all-transactions/TableAllTransactions";
import TableIncome from "./components/table-income/TableIncome";
import TableExpense from "./components/table-expense/TableExpense";
import Accounts from "./pages/accounts/Accounts";
import Settings from "./pages/setting/Settings";
import Splash from "./pages/splash/Splash";
import SendMoney from "./pages/send-money/SendMoney";
import RegisterAdmin from "./pages/register/RegisterAdmin";
import RegisterCashier from "./pages/register/RegisterCashier";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="payper" element={<Layout />}>
      <Route index element={<Splash />} />
      <Route path="menu" element={<NewUserLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="registerasadmin" element={<RegisterAdmin />} />
        <Route path="registerascashier" element={<RegisterCashier />} />
        <Route path="user-collect-data" element={<UserCollectData />} />
      </Route>
      <Route path="home" element={<LoggedInLayout />}>
        <Route index element={<Overview />} />
        <Route path="transactions" element={<Transactions />}>
          <Route index element={<TableAllTransactions />} />
          <Route path="income" element={<TableIncome />} />
          <Route path="expense" element={<TableExpense />} />
        </Route>
        <Route path="send-money" element={<SendMoney />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  )
);

export const AppContext = createContext();

function App() {
  return (
    <AppContext.Provider>
      <RouterProvider router={router}>
        <Layout />
      </RouterProvider>
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
