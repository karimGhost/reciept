"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { Receipt, formatCurrency } from "@/lib/receipt-utils";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import { deleteDoc, doc } from "firebase/firestore";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Calendar, User, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
interface ReceiptHistoryProps {
  onBack: () => void;
  onSelect: (receipt: Receipt) => void;
}



export function ReceiptHistory({ onBack, onSelect }: ReceiptHistoryProps) {
  const [history, setHistory] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const deleteReceipt = async (id: string) => {
  try {
    await deleteDoc(doc(db, "receipts", id));
    setHistory((prev) => prev.filter((r) => r.id !== id));
  } catch (err) {
    console.error("Delete failed:", err);
  }
};




  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "receipts"),
          orderBy("createdAt", "desc"),
          limit(50)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(
          (doc) => doc.data() as Receipt
        );

        setHistory(results);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredHistory = useMemo(() => {
    return history.filter((r) => {
      const matchesSearch =
        r.clientName?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "paid"
          ? r.paymentStatus === "Paid"
          : r.paymentStatus !== "Paid";

      const receiptDate = new Date(r.date);
      const now = new Date();

      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate =
          receiptDate.toDateString() === now.toDateString();
      }

      if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesDate = receiptDate >= weekAgo;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [history, search, statusFilter, dateFilter]);

  const exportToCSV = () => {
  const headers = ["Receipt No", "Date", "Client", "Total", "Status"];

  const rows = filteredHistory.map((r) => [
    r.receiptNumber,
    r.date,
    r.clientName,
    r.grandTotal,
    r.paymentStatus,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "receipts.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <Card className="border-none shadow-2xl bg-white">
      
 

      {/* HEADER */}
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <CardTitle className="text-2xl font-bold">
              Receipt History
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage and view past transactions
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">

        {/* 🔍 FILTERS */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
          </select>
        </div>

       
<Button onClick={exportToCSV} variant="outline">
  Export CSV
</Button>
        {/* TABLE */}
        {loading ? (
          <div className="text-center py-12">
            Loading...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No matching receipts found.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredHistory.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.receiptNumber}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell className="font-bold">
                      {r.clientName}
                    </TableCell>

                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(r.grandTotal)}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={
                          r.paymentStatus === "Paid"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {r.paymentStatus}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => onSelect(r)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>

               
                    </TableCell>
<TableCell>

     <Button
    size="sm"
    variant="destructive"
    onClick={() => deleteReceipt(r.id)}
  >
    Delete
  </Button>
</TableCell>
                         
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}