import createPdf from "../utils/CreatePdf";

const TicketPrueba = async (output) => {
  const content = [
    {
      text: "PRUEBA DE IMPRESIÓN",
      alignment: "center",
      fontSize: 14,
      bold: true,
      margin: [0, 40, 0, 40],
    },

    {
      text: "Este documento es una prueba de impresión de la empresa Cosecha Verde .",
      alignment: "center",
      fontSize: 10,
      margin: [0, 10, 0, 10],
    },
    {
      text: "la impresora está funcionando correctamente.",
      alignment: "center",
      fontSize: 10,
      margin: [0, 10, 0, 20],
    },
    {
      text: "Fecha y hora: " + new Date().toLocaleString(),
      alignment: "center",
      fontSize: 9,
    },
    {
      text: "---------------------------------------------",
      alignment: "center",
      margin: [0, 20, 0, 10],
    },
    {
      text: "Sistema Punto de Venta Cosecha Verde",
      alignment: "center",
      fontSize: 10,
    },
  ];

  const styles = {}; 
  const response = await createPdf({ content, styles }, output);
  return response;
};

export default TicketPrueba;
