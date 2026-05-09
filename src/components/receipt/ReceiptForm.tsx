"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Receipt, ReceiptItem, generateReceiptId } from "@/lib/receipt-utils";
import { ReceiptItemRow } from "./ReceiptItemRow";
import { ReceiptPreview } from "./ReceiptPreview";
import { PlusCircle, Save, Printer, History, RotateCcw, BadgeDollarSign, TimerReset, EyeOff, Eye, DollarSignIcon } from "lucide-react";
import { format } from "date-fns";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {generateFromPreview} from "./generateFromPreview";
import {printReceipt} from "./printReceipt"
interface ReceiptFormProps {
  onShowHistory: () => void;
  onShowAnalytics: () => void;
}

export function ReceiptForm({ onShowHistory,onShowAnalytics }: ReceiptFormProps) {
  const { toast } = useToast();
    const [showPreview, setShowPreview] = useState(true);

  
  const [receipt, setReceipt] = useState<Receipt>({
    id: '',
    receiptNumber: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    clientName: '',
    clientContact: '',
    items: [{ id: '1', name: '', description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    grandTotal: 0,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    createdAt: Date.now(),
  });

  useEffect(() => {
    const id = generateReceiptId();
    setReceipt(prev => ({ ...prev, id, receiptNumber: id }));
  }, []);

  const calculateTotals = (items: ReceiptItem[], taxRate: number, discount: number) => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount - discount;
    return { subtotal, taxAmount, grandTotal };
  };

  const handleUpdateItem = (id: string, updates: Partial<ReceiptItem>) => {
    const newItems = receipt.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    const totals = calculateTotals(newItems, receipt.taxRate, receipt.discount);
    setReceipt({ ...receipt, items: newItems, ...totals });
  };

  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setReceipt({ ...receipt, items: [...receipt.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    if (receipt.items.length === 1) return;
    const newItems = receipt.items.filter(item => item.id !== id);
    const totals = calculateTotals(newItems, receipt.taxRate, receipt.discount);
    setReceipt({ ...receipt, items: newItems, ...totals });
  };

  const handleSave = async () => {
    if (!receipt.clientName) {
      toast({ title: "Client Name Required", description: "Please enter a client name before saving.", variant: "destructive" });
      return;
    }

    try {
          generateFromPreview(receipt)

      await setDoc(doc(db, "receipts", receipt.id), {
        ...receipt,
        createdAt: Date.now()
      });
      toast({ title: "Receipt Saved", description: `Receipt ${receipt.receiptNumber} has been saved successfully.` });
    } catch (error) {
      console.error("Error saving receipt:", error);
      toast({ title: "Save Failed", description: "Could not save the receipt to Firestore. Please check your config.", variant: "destructive" });
    }

  };

  const handlePrint = () => {
   
    printReceipt(receipt)
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6 no-print">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">New Receipt</CardTitle>
              <p className="text-sm text-muted-foreground">Fill in the details for Sultantech Computers</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onShowHistory} className="h-9">
                <History className="h-4 w-4 mr-2" /> History
              </Button>

              <Button style={{background:"green"}}  variant="default" size="sm" onClick={onShowAnalytics} className="h-9 ">
                <DollarSignIcon className="h-4 w-4  mr-2" /> An
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Name</label>
                <Input
                  placeholder="John"
                  value={receipt.clientName}
                  onChange={(e) => setReceipt({ ...receipt, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Contact (Optional)</label>
                <Input
                  placeholder="+254 7..."
                  value={receipt.clientContact}
                  onChange={(e) => setReceipt({ ...receipt, clientContact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Receipt Number</label>
                <Input value={receipt.receiptNumber} readOnly className="bg-muted font-mono" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={receipt.date}
                  onChange={(e) => setReceipt({ ...receipt, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <BadgeDollarSign className="h-5 w-5 text-primary" />
                  Items Sold
                </h3>
                <Button variant="outline" size="sm" onClick={handleAddItem} className="text-primary border-primary hover:bg-primary/10">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
              <div className="space-y-4">
                {receipt.items.map((item) => (
                  <ReceiptItemRow
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdateItem}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select
                  value={receipt.paymentMethod}
                  onValueChange={(val: any) => setReceipt({ ...receipt, paymentMethod: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={receipt.paymentStatus}
                  onValueChange={(val: any) => setReceipt({ ...receipt, paymentStatus: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Rate (%)</label>
                <Input
                  type="number"
                  value={receipt.taxRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value) || 0;
                    const totals = calculateTotals(receipt.items, rate, receipt.discount);
                    setReceipt({ ...receipt, taxRate: rate, ...totals });
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount (KES)</label>
                <Input
                  type="number"
                  value={receipt.discount}
                  onChange={(e) => {
                    const discount = parseFloat(e.target.value) || 0;
                    const totals = calculateTotals(receipt.items, receipt.taxRate, discount);
                    setReceipt({ ...receipt, discount, ...totals });
                  }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/5 p-6 flex flex-wrap gap-4 justify-between items-center rounded-b-xl border-t">
             <div className="flex gap-2">
               <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                 <Save className="h-4 w-4 mr-2" /> Save
               </Button>
               <Button variant="outline" onClick={() => receipt.clientName ?  printReceipt(receipt) : alert("sultan please fill in the client name first!")}>
                 <Printer className="h-4 w-4 mr-2" /> Print / PDF
               </Button>
             </div>
             <div className="text-right">
               <p className="text-xs font-bold text-muted-foreground uppercase">Grand Total</p>
               <p className="text-3xl font-black text-primary">
                 {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(receipt.grandTotal)}
               </p>
             </div>
          </CardFooter>
        </Card>
      </div>

        <div className="sticky top-8">
      <div className="flex items-center justify-between mb-4 no-print">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> Live Preview
        </h2>

        <button
          onClick={() => setShowPreview((prev) => !prev)}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-muted transition"
        >
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4" /> Hide
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" /> Show
            </>
          )}
        </button>
      </div>

      {showPreview && (
        <div className="no-print">
          <ReceiptPreview receipt={receipt} />
        </div>
      )}

    </div>
    </div>
  );
}


