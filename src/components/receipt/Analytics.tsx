"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";

import { Receipt, formatCurrency } from "@/lib/receipt-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

export function Analytics({ onBack }: ReceiptHistoryProps) {
  const [history, setHistory] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const [chartTab, setChartTab] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "receipts"),
          orderBy("createdAt", "desc"),
          limit(100)
        );

        const snap = await getDocs(q);
        setHistory(snap.docs.map((d) => d.data() as Receipt));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ---------------- FILTERED DATA ----------------
  const filteredHistory = useMemo(() => history, [history]);

  // ---------------- GROUP DATA ----------------
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};

    filteredHistory.forEach((r) => {
      const d = new Date(r.date);

      let key = "";

      if (chartTab === "daily") key = d.toLocaleDateString();
      if (chartTab === "weekly")
        key = `Week ${Math.ceil(d.getDate() / 7)}`;
      if (chartTab === "monthly")
        key = d.toLocaleString("default", { month: "short" });

      map[key] = (map[key] || 0) + (r.grandTotal || 0);
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
    }));
  }, [filteredHistory, chartTab]);

  // ---------------- TOP CLIENTS ----------------
  const topClients = useMemo(() => {
    const map: Record<string, number> = {};

    filteredHistory.forEach((r) => {
      if (!r.clientName) return;

      map[r.clientName] =
        (map[r.clientName] || 0) + (r.grandTotal || 0);
    });

    return Object.entries(map)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredHistory]);

  // ---------------- PROFIT ----------------
  const profitStats = useMemo(() => {
    let revenue = 0;
    let cost = 0;

    filteredHistory.forEach((r) => {
      revenue += r.grandTotal || 0;
      cost += r.grandTotal || 0; // FIXED
    });

    return {
      revenue,
      cost,
      profit: revenue - cost,
      margin: revenue ? (revenue - cost) / revenue : 0,
    };
  }, [filteredHistory]);

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">
        Loading analytics...
      </div>
    );
  }

  return (
    <Card className="border-none shadow-2xl bg-white">

      {/* HEADER */}
      <CardHeader className="border-b flex flex-row items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <CardTitle className="text-2xl font-bold">
            Analytics Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Business insights & performance tracking
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="p-4 border rounded-xl">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-xl font-bold">
              {formatCurrency(profitStats.revenue)}
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(profitStats.profit)}
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <p className="text-xs text-muted-foreground">Receipts</p>
            <p className="text-xl font-bold">
              {filteredHistory.length}
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="text-xl font-bold text-blue-600">
              {Math.round(profitStats.margin * 100)}%
            </p>
          </div>
        </div>

        {/* CHART TABS */}
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={chartTab === tab ? "default" : "outline"}
              onClick={() => setChartTab(tab as any)}
            >
              {tab.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* CHART */}
        <div className="h-72 border rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP CLIENTS */}
        <div className="border rounded-xl p-4">
          <h3 className="font-bold mb-4">Top Clients</h3>

          <div className="space-y-2">
            {topClients.map((c, i) => (
              <div
                key={c.name}
                className="flex justify-between"
              >
                <span>
                  #{i + 1} {c.name}
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(c.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}