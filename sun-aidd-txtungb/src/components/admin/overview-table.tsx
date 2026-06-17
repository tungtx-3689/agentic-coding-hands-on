"use client";

import { useState, useMemo } from "react";
import type { DepartmentStat } from "@/lib/db/queries/admin";

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "no", label: "No" },
  { key: "unit", label: "Unit" },
  { key: "totalMember", label: "Total member" },
  { key: "totalSentKudos", label: "Total sent kudos" },
  { key: "totalReceivedKudos", label: "Total received kudos" },
  { key: "totalUserHaveAtleastKudos", label: "Total user have atleast kudos" },
  { key: "totalReceivedSecretBox", label: "Total received secret box" },
] as const;

function exportCSV(data: DepartmentStat[], from: string, to: string) {
  const period = from && to ? ` (${from} to ${to})` : "";
  const header = COLUMNS.map((c) => c.label).join(",");
  const rows = data.map((r) =>
    [r.no, r.unit, r.totalMember, r.totalSentKudos, r.totalReceivedKudos, r.totalUserHaveAtleastKudos, r.totalReceivedSecretBox].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `saa-overview${period}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface OverviewTableProps {
  data: DepartmentStat[];
}

export function OverviewTable({ data }: OverviewTableProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const paged = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-white font-bold text-lg mr-auto">Overview</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#CCCCCC]">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-[#2E3940] text-white text-sm px-3 py-1.5 rounded border border-[#444] focus:outline-none focus:border-[#FFEA9E]"
          />
          <label className="text-sm text-[#CCCCCC]">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-[#2E3940] text-white text-sm px-3 py-1.5 rounded border border-[#444] focus:outline-none focus:border-[#FFEA9E]"
          />
        </div>
        <button
          onClick={() => exportCSV(data, from, to)}
          className="px-4 py-1.5 text-sm bg-[#2E3940] text-white rounded hover:bg-[#3a4a55] transition-colors border border-[#444]"
        >
          Export CSV
        </button>
        <button
          onClick={() => exportCSV(data, from, to)}
          className="px-4 py-1.5 text-sm bg-[#2E3940] text-white rounded hover:bg-[#3a4a55] transition-colors border border-[#444]"
        >
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md">
        <table className="w-full text-sm text-white border-collapse">
          <thead>
            <tr className="bg-[#2E3940]">
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-bold whitespace-nowrap border-b border-[#444]">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={row.unit}
                style={{ background: i % 2 === 0 ? "#2E3940" : "rgba(16, 20, 23, 0.8)" }}
              >
                <td className="px-4 py-3 border-b border-[#333]">{row.no}</td>
                <td className="px-4 py-3 border-b border-[#333] font-medium">{row.unit}</td>
                <td className="px-4 py-3 border-b border-[#333]">{row.totalMember}</td>
                <td className="px-4 py-3 border-b border-[#333]">{row.totalSentKudos}</td>
                <td className="px-4 py-3 border-b border-[#333]">{row.totalReceivedKudos}</td>
                <td className="px-4 py-3 border-b border-[#333]">{row.totalUserHaveAtleastKudos}</td>
                <td className="px-4 py-3 border-b border-[#333]">{row.totalReceivedSecretBox}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#999]">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[#CCCCCC]">
        <span>{data.length} units total</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-[#2E3940] disabled:opacity-40 hover:bg-[#3a4a55] transition-colors"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded transition-colors ${
                p === page ? "bg-[#FFEA9E] text-[#101417] font-bold" : "bg-[#2E3940] hover:bg-[#3a4a55]"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-[#2E3940] disabled:opacity-40 hover:bg-[#3a4a55] transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
