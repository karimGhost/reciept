import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { renderToStaticMarkup } from "react-dom/server";
import { ReceiptPreview } from "./ReceiptPreview";
// export async function generateReceiptPDF(data) {
//   // 1. Create hidden container
//   const container = document.createElement("div");
//   container.style.position = "fixed";
//   container.style.left = "-9999px";
//   container.style.top = "0";

//   // 2. Render ReceiptPreview into it
//   container.innerHTML = renderToStaticMarkup(
//     <ReceiptPreview data={data} />
//   );

//   document.body.appendChild(container);

//   try {
//     // 3. Convert to canvas
//     const canvas = await html2canvas(container, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");

//     // 4. Create PDF
//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight =
//       (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

//     // 5. Save
//     pdf.save(
//       `${data.clientName.replace(/\s+/g, "_")}_receipt.pdf`
//     );
//   } catch (err) {
//     console.error("PDF generation failed:", err);
//   } finally {
//     // 6. Cleanup
//     document.body.removeChild(container);
//   }
// }

export async function generateFromPreview(receipt) {
  const element = document.getElementById("printable-receipt");

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  const fileName = `${receipt.clientName
  .replace(/\s+/g, "_")
  .toLowerCase()}_${receipt.id || Date.now()}.pdf`;
pdf.save(fileName);

}