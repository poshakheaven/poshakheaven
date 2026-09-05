import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider } from "./context/CartContext";
import { StoreProvider } from "./context/StoreContext";
import { WishlistProvider } from "./context/WishlistContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <WishlistProvider>
            <AdminAuthProvider>
              <App />
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
