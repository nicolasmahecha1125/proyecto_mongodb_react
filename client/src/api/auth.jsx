import axios from "./axios";

// registrar usuario(cliente)
export const registerRequest = (user) =>
  axios.post(`/register`, user);

// Registro de administradores (solo superadmin puede)
export const registerAdminRequest = (user) =>
  axios.post(`/register/admin`, user);

// Logear usuario
export const loginRequest = (user) =>
  axios.post(`/login`, user);

// Token de verificacion de usuario
export const verifyTokenRequest = () =>
  axios.get("/verify");

// Borrar usuario
export const deleteUser = async (id) => {
  return await axios.delete(`/users/${id}`, { withCredentials: true });
};

// Obtener usuarios
export const getUsers = async () => {
  return await axios.get("/users");
};

// Obtener perfil del usuario autenticado
export const getMyProfile = async () => {
  return await axios.get("/profile", { withCredentials: true });
};

// Editar perfil del usuario autenticado
export const updateProfile = async (data) => {
  return await axios.put("/profile", data, { withCredentials: true });
};
