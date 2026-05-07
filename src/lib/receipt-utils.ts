export const generateReceiptId = () => {
  const prefix = "ST-";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}-${random}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(amount);
};

export interface ReceiptItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Receipt {

  id: string;
  receiptNumber: string;
  date: string;
  clientName: string;
  clientContact?: string;
  items: ReceiptItem[];
  subtotal: number;
  taxRate: number; // as percentage
  taxAmount: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'M-Pesa' | '';
  paymentStatus: 'Paid' | 'Pending';
  createdAt: number;
}