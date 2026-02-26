import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectRoute from "./components/common/ProtectRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import StockDetailsPage from "./pages/StockDetailsPage";
import UserPanelPage from "./pages/UserPanelPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import MarketPage from "./pages/MarketPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<ProtectRoute><DashboardPage /></ProtectRoute>} />
        <Route path="/market" element={<ProtectRoute><MarketPage /></ProtectRoute>} />
        <Route path="/stocks/:symbol" element={<ProtectRoute><StockDetailsPage /></ProtectRoute>} />
        <Route path="/transactions" element={<ProtectRoute><UserPanelPage /></ProtectRoute>} />
        <Route path="/admin" element={<ProtectRoute adminOnly={true}><AdminPanelPage /></ProtectRoute>} />
        <Route path="/admin/users" element={<ProtectRoute adminOnly={true}><AdminUsersPage /></ProtectRoute>} />
      </Routes>
    </>
  );
}

export default App;
