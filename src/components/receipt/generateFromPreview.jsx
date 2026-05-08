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

  if (!element) {
    alert("Receipt preview not found.");
    return;
  }

  try {
const clone = element.cloneNode(true);
    clone.style.width = "794px"; // desktop/A4-like width
    clone.style.maxWidth = "794px";
    clone.style.minWidth = "794px";
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.background = "#ffffff";
    clone.style.transform = "none";
    clone.style.overflow = "visible";

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: clone.scrollWidth,
      height: clone.scrollHeight,
      windowWidth: 1200,
      windowHeight: clone.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const safeClientName =
      receipt?.clientName?.replace(/\s+/g, "_").toLowerCase() || "receipt";

    const fileName = `${safeClientName}_${receipt?.id || Date.now()}.pdf`;

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to save receipt. Please try again.");
  }
}