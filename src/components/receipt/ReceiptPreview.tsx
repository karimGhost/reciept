"use client";

import { Receipt, formatCurrency } from "@/lib/receipt-utils";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Mail, MapPin } from "lucide-react";

interface ReceiptPreviewProps {
  receipt: Receipt;
}

export function ReceiptPreview({ receipt }: ReceiptPreviewProps) {
  return (
    <Card id="printable-receipt" className="p-8 max-w-3xl mx-auto bg-white sultanBORDER shadow-xl border-t-8 border-t-primary rounded-none">
      <div className="flex justify-between items-start mb-8">
        <div>
          
          <h1 className="text-3xl font-bold text-primary sultan tracking-tight">SULTANTECHKENYA</h1>
          <p className="text-lg font-medium text-muted-foreground">COMPUTERS</p>
          <div className="mt-4 text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>00400 Tom mboya street, Imenti house , Nairobi, Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-3 w-3" />
              <span>+254 791 312 121</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>sultantechkenyacomputers</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={receipt?.paymentStatus === 'Paid' ? 'default' : 'destructive'} className="mb-4 uppercase px-4 py-1">
            {receipt?.paymentStatus || "N/A"}
          </Badge>
          <h2 className="text-xl font-bold">RECEIPT</h2>
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Receipt No:</p>
            <p className="font-mono font-bold">{receipt?.receiptNumber}</p>
          </div>
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">Date:</p>
            <p className="font-bold">{receipt?.date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 border-y py-4 border-muted">
        <div>
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">Bill To:</h3>
          <p className="text-lg font-bold">{receipt?.clientName || 'N/A'}</p>
          <p className="text-sm text-muted-foreground">{receipt?.clientContact || 'No contact provided'}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">Payment Method:</h3>
          <p className="text-lg font-bold">{receipt?.paymentMethod}</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-2 border-primary/20 pb-2">
              <th className="py-2 text-xs font-bold uppercase text-muted-foreground">Item</th>
              <th className="py-2 text-center text-xs font-bold uppercase text-muted-foreground w-16">Qty</th>
              <th className="py-2 text-right text-xs font-bold uppercase text-muted-foreground">Price</th>
              <th className="py-2 text-right text-xs font-bold uppercase text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted">
            {receipt.items.map((item) => (
              <tr key={item.id}>
                <td className="py-4">
                  <p className="font-bold">{item.name || 'Untitled Item'}</p>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{item.description}</p>
                </td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                <td className="py-4 text-right font-bold">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(receipt.subtotal)}</span>
          </div>
          {receipt.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({receipt.taxRate}%)</span>
              <span>{formatCurrency(receipt.taxAmount)}</span>
            </div>
          )}
          {receipt.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-destructive">-{formatCurrency(receipt.discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold text-primary pt-1">
            <span>Total</span>
            <span>{formatCurrency(receipt.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center border-t pt-8">
        <p className="text-sm font-bold text-muted-foreground mb-1">Thank you for choosing Sultantech kenya Computers!</p>
        <p className="text-xs text-muted-foreground">This is a computer-generated receipt No Signature required (©)SultantechComputers Kenya.</p>
      </div>
    </Card>
  );
}