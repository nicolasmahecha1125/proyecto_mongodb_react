export const NAV_LINKS = {
  authenticated: [
    {
      label: "Mis pedidos",
      to: "/mis-compras",
      roles: ["cliente"],
    },
    {
      label: "Pedidos clientes",
      to: "/mis-compras",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Crear producto",
      to: "/add-product",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Gestionar usuarios",
      to: "/manage-users",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Gestionar productos",
      to: "/catalogo",
      roles: ["admin", "superadmin"],
    },
    {
      label: "Crear administrador",
      to: "/register/admin",
      roles: ["superadmin"],
      className: "text-red-400 hover:text-red-500 font-semibold",
    },
    {
      label: "Mi perfil",
      to: "/profile",
      roles: ["cliente", "admin", "superadmin"],
    },
  ],
};
