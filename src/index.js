import app from "./app.js";
import { connectDB } from "./db.js";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";

// 🔹 Función para crear automáticamente el SuperAdmin si no existe
const createSuperAdmin = async () => {
  try {
    const adminEmail = "superadmin@empresa.com"; // correo del superadmin
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("1234567", 10); // contraseña por defecto

      await User.create({
        username: "SuperAdmin",
        email: adminEmail,
        password: passwordHash,
        role: "superadmin",// o "superadmin" si decides usar ese rol
        address: "Dirección administrativa",
      });

      console.log("✅ SuperAdmin creado por defecto:");
      console.log(`   Email: ${adminEmail}`);
      console.log("   Contraseña: 1234567");
    } else {
      console.log("🔹 SuperAdmin ya existe");
    }
  } catch (error) {
    console.error("❌ Error al crear SuperAdmin:", error.message);
  }
};

// 🔹 Conectar a la base de datos y crear SuperAdmin después
const startServer = async () => {
  await connectDB();
  await createSuperAdmin();

  app.listen(4000, () => {
    console.log("🚀 Server on port 4000");
  });
};

startServer();
