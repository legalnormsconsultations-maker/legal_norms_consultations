"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  Award,
  BookOpen,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Info,
  Lightbulb,
  Microscope,
  Pill,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NdaTrendsClient({ initialData }: { initialData?: any }) {
  const {
    kpis = {
      totalApprovals: 0,
      nmeApprovals: 0,
      blaApprovals: 0,
      priorityPercentage: 0,
      medianReviewMonths: 0
    },
    approvalsByYear = [],
    reviewTimes = [],
    therapeuticAreas = [],
    timelineData = []
  } = initialData || {};

  const [timeframe, setTimeframe] = useState("5y");
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            NDA & Drug Approval Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics and predictive insights into FDA approval trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={timeframe === "1y" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("1y")}>1Y</Button>
          <Button variant={timeframe === "3y" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("3y")}>3Y</Button>
          <Button variant={timeframe === "5y" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("5y")}>5Y</Button>
          <Button variant={timeframe === "all" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("all")}>All</Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Approvals" value={kpis.totalApprovals.toString()} trend="" icon={<CheckCircle size={18} />} trendUp={true} />
        <KpiCard title="NME / Novel" value={kpis.nmeApprovals.toString()} trend="" icon={<Microscope size={18} />} trendUp={true} />
        <KpiCard title="BLA Approvals" value={kpis.blaApprovals.toString()} trend="" icon={<Pill size={18} />} trendUp={true} />
        <KpiCard title="Priority Reviews" value={`${kpis.priorityPercentage}%`} trend="" icon={<Award size={18} />} trendUp={true} />
        <KpiCard title="Median Review (Mos)" value={kpis.medianReviewMonths.toString()} trend="" icon={<Clock size={18} />} trendUp={true} />
      </div>

      {/* AI Insight Panel */}
      <div className="bg-gradient-to-r from-orange-900/10 to-indigo-900/10 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={100} />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              AI Regulatory Insight: Oncology Acceleration
            </h3>
            <p className="text-sm text-foreground/80 mt-1 mb-4 max-w-4xl">
              Approval activity in Oncology has increased by 15% over the last 12 months, predominantly driven by 
              Targeted Therapies receiving Priority Review designations. This trend indicates a strong FDA willingness 
              to expedite precision medicine submissions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-background/60 p-3 rounded-lg border border-border/50">
                <span className="block text-xs text-muted-foreground font-semibold mb-1">EVIDENCE</span>
                42 Oncology approvals YTD, 85% utilizing expedited pathways.
              </div>
              <div className="bg-background/60 p-3 rounded-lg border border-border/50">
                <span className="block text-xs text-muted-foreground font-semibold mb-1">POSSIBLE DRIVER</span>
                Advancements in biomarker-driven patient selection criteria.
              </div>
              <div className="bg-background/60 p-3 rounded-lg border border-border/50">
                <span className="block text-xs text-muted-foreground font-semibold mb-1">IMPLICATION</span>
                Sponsors should aggressively pursue Breakthrough Therapy for targeted agents early in phase 2.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <TabButton active={selectedTab === "overview"} onClick={() => setSelectedTab("overview")} label="Overview & Trends" />
        <TabButton active={selectedTab === "timeline"} onClick={() => setSelectedTab("timeline")} label="Review Timelines" />
        <TabButton active={selectedTab === "benchmarking"} onClick={() => setSelectedTab("benchmarking")} label="Sponsor Benchmarking" />
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Approvals by Application Type (NDA vs BLA)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={approvalsByYear} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNda" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBla" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="nda" name="NDA Approvals" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorNda)" />
                  <Area type="monotone" dataKey="bla" name="BLA Approvals" stroke="#6366f1" fillOpacity={1} fill="url(#colorBla)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
              <Target size={18} className="text-primary" /> Approvals by Therapeutic Area
            </h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={therapeuticAreas}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {therapeuticAreas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-sm">
             <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Median Review Times (Priority vs Standard)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reviewTimes} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 15]} unit=" mo" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="priority" name="Priority Review (Months)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="standard" name="Standard Review (Months)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "timeline" && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Application Review Timelines
            </h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search drug or sponsor..." 
                className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Application</th>
                  <th className="px-6 py-4 font-medium">Drug & Sponsor</th>
                  <th className="px-6 py-4 font-medium">Therapeutic Area</th>
                  <th className="px-6 py-4 font-medium">Designation</th>
                  <th className="px-6 py-4 font-medium">Timeline (Months)</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timelineData.map((item, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{item.drug}</div>
                      <div className="text-xs text-muted-foreground">{item.sponsor}</div>
                    </td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.designation === "Priority" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                      }`}>
                        {item.designation}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 w-full max-w-[200px]">
                        <span className="text-xs font-mono w-8">{item.time}m</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.designation === "Priority" ? "bg-emerald-500" : "bg-indigo-500"}`} 
                            style={{ width: `${Math.min((item.time / 15) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle size={14} /> Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTab === "benchmarking" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
            <Building className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Sponsor Benchmarking</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Select companies to compare approval volumes, success rates, and expedited pathway utilization.
            </p>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <select className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Company A</option>
                <option>Amgen</option>
                <option>Pfizer</option>
                <option>Novartis</option>
              </select>
              <span className="text-muted-foreground text-sm font-medium">VS</span>
              <select className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Company B</option>
                <option>Biogen</option>
                <option>Eli Lilly</option>
                <option>Merck</option>
              </select>
            </div>
            <Button className="mt-6 w-full max-w-sm" variant="secondary">Generate Comparison</Button>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] text-center shadow-sm">
            <Target className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Therapeutic Area Benchmarking</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Compare regulatory performance across different indications and therapeutic categories.
            </p>
            <div className="flex items-center gap-3 w-full max-w-sm">
              <select className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Area A</option>
                <option>Oncology</option>
                <option>Neurology</option>
              </select>
              <span className="text-muted-foreground text-sm font-medium">VS</span>
              <select className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Area B</option>
                <option>Immunology</option>
                <option>Cardiology</option>
              </select>
            </div>
            <Button className="mt-6 w-full max-w-sm" variant="secondary">Generate Comparison</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, trend, icon, trendUp }: { title: string; value: string; trend: string; icon: React.ReactNode; trendUp: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="flex items-end justify-between mt-1">
        <span className="text-2xl font-bold font-heading text-foreground">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trendUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
const COLORS = ["#0ea5e9", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active 
          ? "border-primary text-primary" 
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
      }`}
    >
      {label}
    </button>
  );
}
