import { urlToBase64 } from "../utils/Conversiones";
import createPdf from "../utils/CreatePdf";

const TicketVenta = async (output, data) => {
  const fechaCompleta = data.dataventas?.fecha;
  const fechaObj = new Date(fechaCompleta);
  const simboloMoneda = data.dataempresa?.simbolo_moneda || "Q";

  const fecha = fechaObj.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = fechaObj.toLocaleTimeString("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ✅ Cargar logo (local o remoto)
  const logoempresa = await urlToBase64(
    data.dataempresa?.logo === "-" || !data.dataempresa?.logo
      ? "/pos-ventas-18-06-2025/public/CVLOGO.png" // usa el PNG sin fondo
      : data.dataempresa?.logo
  );

  // ✅ Datos de pago
  const metodoPago = data.metodosPago?.[0] || {};
  const tipoPago = metodoPago.tipo || "Efectivo";
  const montoRecibido = Number(metodoPago.monto || 0);
  const vuelto = Number(metodoPago.vuelto || 0);
  const total = Number(data.dataventas?.monto_total || 0);

  // ✅ Tabla de productos
  const productTableBody = [
    [
      { text: "Descripción", style: "tProductsHeader" },
      { text: "Cant.", style: "tProductsHeader", alignment: "center" },
      { text: "UM", style: "tProductsHeader", alignment: "center" },
      { text: "Precio", style: "tProductsHeader", alignment: "right" },
      { text: "Total", style: "tProductsHeader", alignment: "right" },
    ],
    ...data.productos.map((item) => [
      {
        text: `${item.productos?.codigo_barras || ""} - ${item.productos?.nombre || ""}`,
        style: "tProductsBody",
      },
      { text: item?.cantidad?.toString() || "0", style: "tProductsBody", alignment: "center" },
      { text: item?.unidad_medida || "unidad", style: "tProductsBody", alignment: "center" },
      { text: `${simboloMoneda} ${Number(item?.precio_venta || 0).toFixed(2)}`, style: "tProductsBody", alignment: "right" },
      { text: `${simboloMoneda} ${Number(item?.total || 0).toFixed(2)}`, style: "tProductsBody", alignment: "right" },
    ]),
  ];

  // ✅ Contenido del ticket
  const content = [
    { text: " ", margin: [0, 25] },

    // LOGO (sin borde ni fondo circular)
    {
      image: logoempresa,
      width: 100,
      alignment: "center",
      margin: [0, 0, 0, 10],
    },

    // DATOS DE LA EMPRESA
    { text: data.dataempresa?.nombre, style: "header" },
    { text: data.dataempresa?.direccion_fiscal, style: "header" },
    { text: data.dataempresa?.id_fiscal, style: "header" },
    { text: data.nombreComprobante, style: "header", margin: [0, 10, 0, 2] },
    { text: data.dataventas?.nro_comprobante, style: "header", margin: [0, 0, 0, 10] },

    // DATOS GENERALES
    {
      table: {
        widths: ["25%", "35%", "15%", "25%"],
        body: [
          [
            { text: "FECHA:", style: "tHeaderLabel" },
            { text: fecha, style: "tHeaderValue" },
            { text: "HORA:", style: "tHeaderLabel" },
            { text: hora, style: "tHeaderValue" },
          ],
          [
            { text: "CAJERO:", style: "tHeaderLabel" },
            { text: data.nombrecajero, style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],
          [
            { text: "CLIENTE:", style: "tHeaderLabel" },
            { text: data.dataCliente?.nombres || "Genérico", style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],
          [
            { text: "DPI:", style: "tHeaderLabel" },
            { text: data.dataCliente?.identificador_fiscal || "-", style: "tHeaderValue", colSpan: 3 },
            {},
            {},
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 5, 0, 10],
    },

    // TABLA PRODUCTOS
    {
      table: {
        widths: ["35%", "10%", "10%", "20%", "25%"],
        body: productTableBody,
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => "#a9a9a9",
      },
      margin: [0, 10, 0, 10],
    },

    // TOTALES
    {
      table: {
        widths: ["60%", "40%"],
        body: [
          [
            { text: "Subtotal:", style: "tTotals", alignment: "right" },
            { text: `${simboloMoneda} ${Number(data.dataventas?.sub_total || 0).toFixed(2)}`, style: "tTotals" },
          ],
          [
            { text: "IVA (Incluido):", style: "tTotals", alignment: "right" },
            { text: `${simboloMoneda} ${Number(data.dataventas?.total_impuestos || 0).toFixed(2)}`, style: "tTotals" },
          ],
          [
            { text: "TOTAL:", style: "tTotalsBig", alignment: "right" },
            { text: `${simboloMoneda} ${total.toFixed(2)}`, style: "tTotalsBig" },
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 10, 0, 5],
    },

    // FORMA DE PAGO Y VUELTO
    {
      table: {
        widths: ["50%", "50%"],
        body: [
          [
            { text: "Forma de pago:", style: "tTotals", alignment: "right" },
            { text: `${tipoPago} (${simboloMoneda} ${total.toFixed(2)})`, style: "tTotals", alignment: "left" },
          ],
          [
            { text: "Monto recibido:", style: "tTotals", alignment: "right" },
            { text: `${simboloMoneda} ${montoRecibido.toFixed(2)}`, style: "tTotals", alignment: "left" },
          ],
          [
            { text: "Vuelto:", style: "tTotals", alignment: "right" },
            { text: `${simboloMoneda} ${vuelto.toFixed(2)}`, style: "tTotals", alignment: "left" },
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 5, 0, 15],
    },

    // QR + PIE
    {
      qr: `${data.dataempresa?.id_fiscal}|${data.dataventas?.nro_comprobante}|${data.dataventas.monto_total}|${fecha}${hora}`,
      fit: 110,
      alignment: "center",
      eccLevel: "Q",
      margin: [0, 10, 0, 4],
    },
    {
      text: "Consulta tu factura digital aquí:",
      style: "text",
      alignment: "center",
    },
    {
      text: "Escanea el QR",
      style: "text",
      alignment: "center",
    },
    {
      text: "Representación del comprobante original.",
      style: "footer",
      alignment: "center",
      margin: [0, 8],
    },

    { text: " ", margin: [0, 15] },
  ];

  // ✅ Estilos
  const styles = {
    header: { fontSize: 9, bold: true, alignment: "center" },
    tHeaderLabel: { fontSize: 8, alignment: "right" },
    tHeaderValue: { fontSize: 8, bold: true },
    tProductsHeader: { fontSize: 8.5, bold: true, fillColor: "#f0f0f0" },
    tProductsBody: { fontSize: 8, alignment: "left" },
    tTotals: { fontSize: 9, bold: true },
    tTotalsBig: { fontSize: 10, bold: true },
    text: { fontSize: 8 },
    link: { fontSize: 8, bold: true, color: "#0056b3", alignment: "center" },
    footer: { fontSize: 7, italics: true },
  };

  const response = await createPdf({ content, styles }, output);
  return response;
};

export default TicketVenta;
