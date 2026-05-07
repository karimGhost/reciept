import { renderToStaticMarkup } from "react-dom/server";
import { ReceiptPreview } from "./ReceiptPreview";
export function printReceipt(receipt) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Popup blocked! Allow popups to print.");
    return;
  }

  const html = renderToStaticMarkup(
    <ReceiptPreview receipt={receipt} />
  );

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
          }
.sultan{
color: #144AA9;
}
.sultanBORDER{
  border-color: #144AA9;
}
          /* Optional: force full width */
          #root {
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `);
  printWindow.document.close();

  // Wait for content to render before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();

    // optional auto close
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
}