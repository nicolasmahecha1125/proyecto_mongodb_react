import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
//import { TaskProvider } from "./context/TasksContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
//import TasksPage from "./pages/TasksPage";
//import TaskFormPage from "./pages/TaskFormPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";
import CatalogoPage from "./pages/CatalogoPage";
import CreateProductPage from "./pages/CreateProductPage";
import RegisterAdminPage from "./pages/RegisterAdminPage";
import ManageUsersPage from "./pages/ManageUsersPage"; 
import MyOrdersPage from "./pages/MyOrdersPage";
import EditProductPage from "./pages/EditProductPage";
import EditOrderPage from "./pages/EditOrderPage";


function App() {
  return (
    <AuthProvider>
      {/*<TaskProvider>*/}
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <main className="container mx-auto px-15">
                <Navbar />
                <Routes>
                  {/* 🌐 Rutas públicas */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/catalogo" element={<CatalogoPage />} />

                  {/* 🔐 Rutas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    {/* 📦 Gestión de productos */}
                    <Route path="/add-product" element={<CreateProductPage />} />

                    {/* ✅ Tareas */}
                    {/*<Route path="/tasks" element={<TasksPage />} />
                    <Route path="/add-task" element={<TaskFormPage />} />
                    <Route path="/tasks/:id" element={<TaskFormPage />} />}

                    {/* 👤 Perfil */}
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* 🧑‍💼 Solo superadmin */}
                    <Route path="/register/admin" element={<RegisterAdminPage />} />

                    {/* 👥 Admin y superadmin */}
                    <Route path="/manage-users" element={<ManageUsersPage />} />

                    <Route path="/mis-compras" element={<MyOrdersPage />} />
                    <Route path="/products/editar/:id" element={<EditProductPage />} />
                    <Route path="/orders/:id" element={<EditOrderPage />} />
                  </Route>
                </Routes>
              </main>
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      {/*</TaskProvider>*/}
    </AuthProvider>
  );
}

export default App;

