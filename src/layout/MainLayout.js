import Navbar from "./Navbar";
import StaffNavbar from "./StaffNavbar";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function MainLayout() {
  const { user } = useAuth() || {};
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/user");

  return (
    <>
      {!hideNavbar && user?.role === "MANAGER" && <Navbar />}
      {!hideNavbar && user?.role === "STAFF" && <StaffNavbar />}

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
