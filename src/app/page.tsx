"use client";

import { useState } from "react";
import { ReceiptForm } from "@/components/receipt/ReceiptForm";
import { ReceiptHistory } from "@/components/receipt/ReceiptHistory";
import { ReceiptPreview } from "@/components/receipt/ReceiptPreview";
import { Receipt } from "@/lib/receipt-utils";
import { Toaster } from "@/components/ui/toaster";
import { Monitor } from "lucide-react";
import { Analytics } from "@/components/receipt/Analytics";
export default function Home() {
  const [view, setView] = useState<'form' | 'history' |  'Analytics' | 'preview'>('form');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const handleShowHistory = () => setView('history');
  const handleonShowAnalytics = () => setView('Analytics')
  const handleBackToForm = () => setView('form');
  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setView('preview');
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="bg-primary text-white py-8 px-6 no-print mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
     <div className="leading-none">
  <h1
    className="
      text-3xl
      sm:text-4xl
      font-black
      tracking-[-0.06em]
      leading-none
    "
    style={{
      fontFamily: "Arial Black, sans-serif",
    }}
  >
    <span className="text-fuchsia-700">Sultan</span>
    <span className="text-blue-600">tech</span>
    <span className="text-blue-700">Kenya</span>
  </h1>

  <p
    className="
      mt-1
      text-[10px]
      sm:text-xs
      font-extrabold
      uppercase
      tracking-[0.45em]
      text-blue-700
      ml-1
    "
    style={{
      fontFamily: "Arial, sans-serif",
    }}
  >
    RECEIPT MAKER
  </p>
</div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium opacity-80 italic">Precision Technology, Professional Service</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {view === 'form' && (
          <ReceiptForm onShowAnalytics={handleonShowAnalytics} onShowHistory={handleShowHistory} />
        )}

        {view === 'history' && (
          <ReceiptHistory onBack={handleBackToForm} onSelect={handleViewReceipt} />
        )}

 {view === 'Analytics' && (
          <Analytics onBack={handleBackToForm} onSelect={handleViewReceipt} />
        )}

        {view === 'preview' && selectedReceipt && (
          <div className="space-y-6">
            <div className="no-print flex justify-between items-center mb-4">
              <button 
                onClick={handleShowHistory}
                className="text-primary font-bold hover:underline flex items-center gap-2"
              >
                ← Back to History
              </button>
              <div className="flex gap-4">
                 <button 
                  onClick={() => window.print()}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition shadow-lg"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
            <ReceiptPreview receipt={selectedReceipt} />
          </div>
        )}
      </div>

      <Toaster />
    </main>
  );
}