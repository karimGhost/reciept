"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Sparkles, Loader2 } from "lucide-react";
import { ReceiptItem } from "@/lib/receipt-utils";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";

interface ReceiptItemRowProps {
  item: ReceiptItem;
  onUpdate: (id: string, updates: Partial<ReceiptItem>) => void;
  onRemove: (id: string) => void;
}

export function ReceiptItemRow({ item, onUpdate, onRemove }: ReceiptItemRowProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiDescription = async () => {
    if (!item.name) return;
    setIsGenerating(true);
    try {
      const result = await generateProductDescription({
        itemName: item.name,
        specs: item.description || "standard specifications",
      });
      onUpdate(item.id, { description: result.description });
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
      <div className="md:col-span-3 space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Item Name</label>
        <Input
          placeholder="e.g. MacBook Pro"
          value={item.name}
          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
        />
      </div>
      <div className="md:col-span-4 space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Description / Specs</label>
          {/* <Button
            variant="ghost"
            size="sm"
            className="h-6 text-primary hover:text-accent flex gap-1 items-center px-1"
            onClick={handleAiDescription}
            disabled={!item.name || isGenerating}
          >
            {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            <span className="text-[10px]">AI Enhance</span>
          </Button> */}
        </div>
        <Textarea
          placeholder="RAM, CPU, Storage..."
          rows={2}
          className="resize-none"
          value={item.description}
          onChange={(e) => onUpdate(item.id, { description: e.target.value })}
        />
      </div>
      <div className="md:col-span-1 space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Qty</label>
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {
            const qty = parseInt(e.target.value) || 0;
            onUpdate(item.id, { quantity: qty, total: qty * item.unitPrice });
          }}
        />
      </div>
      <div className="md:col-span-2 space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Price</label>
        <Input
          type="number"
          min="0"
          value={item.unitPrice}
          onChange={(e) => {
            const price = parseFloat(e.target.value) || 0;
            onUpdate(item.id, { unitPrice: price, total: price * item.quantity });
          }}
        />
      </div>
      <div className="md:col-span-1 space-y-1">
        <label className="text-xs font-semibold uppercase text-muted-foreground">Total</label>
        <div className="h-10 flex items-center font-bold text-sm">
          {new Intl.NumberFormat().format(item.total)}
        </div>
      </div>
      <div className="md:col-span-1 flex items-end justify-center pb-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}