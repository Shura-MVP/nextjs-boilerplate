"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from "lucide-react";

// ============================================
// أنواع البيانات
// ============================================
export type ChartType = "line" | "bar" | "pie" | "radar";

export interface DataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

interface DataChartProps {
  type: ChartType;
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  unit?: string;
  height?: number;
}

// ============================================
// لوحة ألوان للرسوم
// ============================================
const CHART_COLORS = [
  "#BFA15A", // ذهبي
  "#748867", // زيتوني فاتح
  "#A88A3F", // ذهبي متوسط
  "#536348", // زيتوني
  "#8E7333", // ذهبي عميق
  "#4A6B7A", // أزرق رمادي
  "#A04545", // أحمر مكتوم
  "#9DAE94", // زيتوني فاتح جدًا
];

// ============================================
// المكوّن الرئيسي
// ============================================
export default function DataChart({
  type,
  data,
  title,
  subtitle,
  unit,
  height = 320,
}: DataChartProps) {
  const Icon =
    type === "line"
      ? TrendingUp
      : type === "bar"
      ? BarChart3
      : type === "pie"
      ? PieIcon
      : Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="panel-sovereign overflow-hidden"
    >
      {/* ============================================
          الرأس
          ============================================ */}
      {(title || subtitle) && (
        <header className="border-b border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/40 px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgb(var(--gold-base))]/15 text-[rgb(var(--gold-bright))]">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                {title && (
                  <h3 className="font-display text-sm font-semibold text-[rgb(var(--text-primary))] sm:text-base">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {unit && (
              <span className="rounded-md border border-[rgb(var(--border-subtle))]/15 bg-[rgb(var(--bg-elevated))]/50 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[rgb(var(--text-muted))]">
                {unit}
              </span>
            )}
          </div>
        </header>
      )}

      {/* ============================================
          الرسم البياني
          ============================================ */}
      <div className="p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={height}>
          {type === "line" ? (
            <LineChartView data={data} />
          ) : type === "bar" ? (
            <BarChartView data={data} />
          ) : type === "pie" ? (
            <PieChartView data={data} />
          ) : (
            <RadarChartView data={data} />
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ============================================
// رسم خطي
// ============================================
function LineChartView({ data }: { data: DataPoint[] }) {
  return (
    <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
      <defs>
        <linearGradient id="goldLineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8E7333" stopOpacity={0.8} />
          <stop offset="50%" stopColor="#BFA15A" stopOpacity={1} />
          <stop offset="100%" stopColor="#E8DCAE" stopOpacity={0.8} />
        </linearGradient>
      </defs>

      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.1}
        vertical={false}
      />

      <XAxis
        dataKey="label"
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.4}
        tick={{ fill: "rgb(142, 115, 51)", fontSize: 11 }}
        reversed
      />

      <YAxis
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.4}
        tick={{ fill: "rgb(142, 115, 51)", fontSize: 11 }}
        orientation="right"
      />

      <Tooltip content={<CustomTooltip />} />

      <Line
        type="monotone"
        dataKey="value"
        stroke="url(#goldLineGradient)"
        strokeWidth={2.5}
        dot={{ fill: "#BFA15A", r: 4 }}
        activeDot={{ r: 6, fill: "#E8DCAE", stroke: "#BFA15A", strokeWidth: 2 }}
      />
    </LineChart>
  );
}

// ============================================
// رسم أعمدة
// ============================================
function BarChartView({ data }: { data: DataPoint[] }) {
  return (
    <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
      <defs>
        <linearGradient id="goldBarGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DCAE" stopOpacity={1} />
          <stop offset="100%" stopColor="#8E7333" stopOpacity={0.8} />
        </linearGradient>
      </defs>

      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.1}
        vertical={false}
      />

      <XAxis
        dataKey="label"
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.4}
        tick={{ fill: "rgb(142, 115, 51)", fontSize: 11 }}
        reversed
      />

      <YAxis
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.4}
        tick={{ fill: "rgb(142, 115, 51)", fontSize: 11 }}
        orientation="right"
      />

      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(191, 161, 90, 0.05)" }} />

      <Bar dataKey="value" fill="url(#goldBarGradient)" radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}

// ============================================
// رسم دائري
// ============================================
function PieChartView({ data }: { data: DataPoint[] }) {
  return (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={2}
        dataKey="value"
        label={({ label, percent }) =>
          `${label} ${((percent ?? 0) * 100).toFixed(0)}%`
        }
        labelLine={{ stroke: "rgb(191, 161, 90)", strokeOpacity: 0.4 }}
      >
        {data.map((entry, idx) => (
          <Cell
            key={`cell-${idx}`}
            fill={CHART_COLORS[idx % CHART_COLORS.length]}
            stroke="rgb(6, 7, 10)"
            strokeWidth={2}
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        wrapperStyle={{
          fontSize: 11,
          color: "rgb(191, 161, 90)",
        }}
      />
    </PieChart>
  );
}

// ============================================
// رسم رادار
// ============================================
function RadarChartView({ data }: { data: DataPoint[] }) {
  return (
    <RadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
      <PolarGrid
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.15}
      />
      <PolarAngleAxis
        dataKey="label"
        tick={{ fill: "rgb(191, 161, 90)", fontSize: 11 }}
      />
      <PolarRadiusAxis
        stroke="rgb(191, 161, 90)"
        strokeOpacity={0.3}
        tick={{ fill: "rgb(142, 115, 51)", fontSize: 10 }}
      />
      <Radar
        name="القيمة"
        dataKey="value"
        stroke="#BFA15A"
        fill="#BFA15A"
        fillOpacity={0.25}
        strokeWidth={2}
      />
      <Tooltip content={<CustomTooltip />} />
    </RadarChart>
  );
}

// ============================================
// Tooltip مخصّص
// ============================================
interface TooltipPayload {
  payload?: { label?: string };
  name?: string;
  value?: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const label = item.payload?.label ?? item.name ?? "";
  const value = item.value;

  return (
    <div className="rounded-lg border border-[rgb(var(--gold-base))]/30 bg-[rgb(var(--bg-elevated))]/95 px-3 py-2 backdrop-blur-sm">
      <p className="font-display text-xs font-medium text-[rgb(var(--text-primary))]">
        {label}
      </p>
      <p className="font-mono text-sm font-bold text-[rgb(var(--gold-bright))]">
        {typeof value === "number"
          ? value.toLocaleString("ar-SA")
          : value}
      </p>
    </div>
  );
}
