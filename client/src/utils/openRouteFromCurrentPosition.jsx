export const openRouteFromCurrentPosition = (destinationAddress) => {

  // Validar dirección
  if (!destinationAddress || destinationAddress.trim() === "") {
    alert("⚠ No hay una dirección válida para este pedido.");
    return;
  }

  // Verificar soporte de geolocalización
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      const origin = `${latitude},${longitude}`;
      const destination = encodeURIComponent(destinationAddress);

      // ✅ Google Maps sin API KEY
      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${origin}` +
        `&destination=${destination}` +
        `&travelmode=driving`;

      // ✅ Abrir en nueva pestaña
      window.open(url, "_blank");
    },
    () => {
      alert("❌ No fue posible obtener tu ubicación.");
    }
  );
};
