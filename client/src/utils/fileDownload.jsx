/**
 * Descarga un archivo blob en el navegador.
 * @param {Blob} blob - Datos binarios del archivo.
 * @param {string} filename - Nombre con el que se descargará el archivo.
 */
export function downloadBlob(blob, filename) {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Error al intentar descargar el archivo:", error);
    alert("Hubo un problema al descargar el archivo.");
  }
}
