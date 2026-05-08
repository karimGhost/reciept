"use client";

import { Receipt, formatCurrency } from "@/lib/receipt-utils";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Mail, MapPin, Settings, Cog } from "lucide-react";

interface ReceiptPreviewProps {
  receipt: Receipt;
}

export function ReceiptPreview({ receipt }: ReceiptPreviewProps) {
  return (
  <Card
  id="printable-receipt"
  className="
    w-full
    overflow-hidden
    bg-white
    shadow-xl
    border-t-8
    border-t-primary
    sultanBORDER
    rounded-none

    p-4
    sm:p-6
    md:p-8

    max-w-3xl
    mx-auto
  "
>
  {/* HEADER */}
  <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start mb-8">
    <div className="min-w-0">
  <div className="leading-none w-fit">
  <h1
    className="text-4xl font-black tracking-[-0.06em] leading-none whitespace-nowrap"
    style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
  >
    <span className="text-fuchsia-700">SULTAN</span>
    <span className="text-blue-600">TECH</span>
    <span className="text-blue-700">KENYA</span>
  </h1>

 <div
  className="mt-1 flex items-center leading-none whitespace-nowrap font-black text-2xl"
  style={{ fontFamily: "Arial Black, Arial, sans-serif" }}
>
  <span className="text-blue-600">C</span>

  <span
    className="text-blue-600 inline-block mx-[1px] leading-none"
    style={{
      fontSize: "30px",
      transform: "translateY(1px)",
    }}
  >
    ⚙
  </span>

  <span className="text-blue-600">MP</span>

  <span className="text-fuchsia-700">UTERS</span>
</div>
</div>
      <div className="mt-4 text-xs sm:text-sm text-muted-foreground space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 mt-1 shrink-0" />
          <span className="break-words">
            00400 Tom Mboya Street, Imenti House, Nairobi, Kenya
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Smartphone className="h-3 w-3 shrink-0" />
          <span>+254 791 312 121</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 shrink-0" />
          <span className="break-all">
            sultantechkenyacomputers
          </span>
        </div>
      </div>
    </div>

    <div className="text-left sm:text-right shrink-0">
      <Badge
        variant={
          receipt?.paymentStatus === "Paid"
            ? "default"
            : "destructive"
        }
        className="mb-4 uppercase px-4 py-1"
      >
        {receipt?.paymentStatus || "N/A"}
      </Badge>

      <h2 className="text-lg sm:text-xl font-bold">
        RECEIPT
      </h2>

      <div className="mt-2 text-xs sm:text-sm">
        <p className="text-muted-foreground">Receipt No:</p>
        <p className="font-mono font-bold break-all">
          {receipt?.receiptNumber}
        </p>
      </div>

      <div className="mt-2 text-xs sm:text-sm">
        <p className="text-muted-foreground">Date:</p>
        <p className="font-bold">{receipt?.date}</p>
      </div>
    </div>
  </div>

  {/* CLIENT INFO */}
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      gap-6
      mb-8
      border-y
      py-4
      border-muted
    "
  >
    <div>
      <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
        Bill To:
      </h3>

      <p className="text-base sm:text-lg font-bold break-words">
        {receipt?.clientName || "N/A"}
      </p>

      <p className="text-sm text-muted-foreground break-words">
        {receipt?.clientContact || "No contact provided"}
      </p>
    </div>

    <div className="sm:text-right">
      <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">
        Payment Method:
      </h3>

      <p className="text-base sm:text-lg font-bold">
        {receipt?.paymentMethod}
      </p>
    </div>
  </div>

  {/* TABLE */}
<div className="mb-8">
  <table className="w-full border-collapse table-fixed">
    <thead>
      <tr className="text-left border-b-2 border-primary/20">
        <th className="py-2 pr-2 text-xs font-bold uppercase text-muted-foreground w-[45%]">
          Item
        </th>

        <th className="py-2 px-1 text-center text-xs font-bold uppercase text-muted-foreground w-[15%]">
          Qty
        </th>

       

        <th className="py-2 pl-1 text-right text-xs font-bold uppercase text-muted-foreground w-[20%]">
          Total
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-muted">
      {receipt.items.map((item) => (
        <tr key={item.id} className="align-top">
          <td className="py-4 pr-2">
            <p className="font-bold text-sm break-words">
              {item.name || "Untitled Item"}
            </p>

            <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line break-words">
              {item.description}
            </p>
          </td>

          <td className="py-4 px-1 text-center text-sm">
            {item.quantity}
          </td>

        
          <td className="py-4 pl-1 text-right font-bold text-sm whitespace-nowrap">
            {formatCurrency(item.total)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  {/* TOTALS */}
  <div className="flex justify-center sm:justify-end mb-8">
    <div className="w-full sm:w-64 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Subtotal
        </span>

        <span>
          {formatCurrency(receipt.subtotal)}
        </span>
      </div>

      {receipt.taxAmount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Tax ({receipt.taxRate}%)
          </span>

          <span>
            {formatCurrency(receipt.taxAmount)}
          </span>
        </div>
      )}

      {receipt.discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Discount
          </span>

          <span className="text-destructive">
            -{formatCurrency(receipt.discount)}
          </span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between text-lg font-bold text-primary pt-1">
        <span>Total</span>

        <span>
          {formatCurrency(receipt.grandTotal)}
        </span>
      </div>
    </div>
  </div>

  {/* FOOTER */}
  <div className="mt-12 text-center border-t pt-8">
    <p className="text-sm font-bold text-muted-foreground mb-1">
      Thank you for choosing Sultantech Kenya Computers!
    </p>

    <p className="text-xs text-muted-foreground leading-relaxed">
      Goods once sold Cannot Be Returned.
      © Sultantech Computers Kenya.
    </p>
  </div>
</Card>
  );
}