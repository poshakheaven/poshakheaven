import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { EmptyState } from "./components/EmptyState";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminBanners } from "./pages/AdminBanners";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminSettings } from "./pages/AdminSettings";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { InfoPage } from "./pages/InfoPage";
import { OrderSuccess } from "./pages/OrderSuccess";
import { Orders } from "./pages/Orders";
import { ProductDetails } from "./pages/ProductDetails";
import { Shop } from "./pages/Shop";
import { Wishlist } from "./pages/Wishlist";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminArea ? <Header /> : null}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:categorySlug" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success/:orderId" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/track-order" element={<Orders />} />
          <Route path="/track" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<InfoPage type="about" />} />
          <Route path="/contact" element={<InfoPage type="contact" />} />
          <Route path="/privacy-policy" element={<InfoPage type="privacy" />} />
          <Route
            path="/terms-and-conditions"
            element={<InfoPage type="terms" />}
          />
          <Route path="/shipping-policy" element={<InfoPage type="shipping" />} />
          <Route path="/return-policy" element={<InfoPage type="returns" />} />
          <Route path="/secure-admin-login" element={<AdminLogin />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          <Route
            path="/admin/*"
            element={<Navigate to="/admin" replace />}
          />
          <Route
            path="*"
            element={
              <EmptyState title="Page Not Found">
                The page you are looking for does not exist.
              </EmptyState>
            }
          />
        </Routes>
      </main>
      {!isAdminArea ? <Footer /> : null}
    </>
  );
}

export default function App() {
  return <AppShell />;
}
