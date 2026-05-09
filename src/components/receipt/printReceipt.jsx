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

  printWindow.document.write(`
    <html>
      <head>
        <title>${receipt?.clientName + "_" + receipt?.id}</title>

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        />

        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: white;
          }

          .sultan {
            color: #144AA9;
          }
          .TANColor {
          color: #A21CAF;
          }
          .txtBlu {
          color: #010f27;
          }
          .sultanBORDER {
            border-color: #144AA9;
          }
        </style>
      </head>

      <body>
        <div id="root">
          ${html}
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 500);
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}