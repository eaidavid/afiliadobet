import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, TrendingUp, MousePointer, Target, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AffiliateReports() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [reportType, setReportType] = useState("performance");

  const { data: stats } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });

  const { data: performance } = useQuery({
    queryKey: ["/api/affiliate/performance", { days: 30 }],
  });

  // Mock data for demonstration
  const mockPerformanceData = [
    { date: '2024-01-01', clicks: 150, conversions: 8, commission: 420 },
    { date: '2024-01-02', clicks: 180, conversions: 12, commission: 680 },
    { date: '2024-01-03', clicks: 220, conversions: 15, commission: 825 },
    { date: '2024-01-04', clicks: 190, conversions: 10, commission: 550 },
    { date: '2024-01-05', clicks: 240, conversions: 18, commission: 980 },
    { date: '2024-01-06', clicks: 200, conversions: 14, commission: 770 },
    { date: '2024-01-07', clicks: 280, conversions: 20, commission: 1200 },
  ];

  const mockHousePerformance = [
    { name: 'Bet365', conversions: 45, commission: 2400, color: '#3B82F6' },
    { name: 'Betano', conversions: 32, commission: 1800, color: '#10B981' },
    { name: 'Sportingbet', conversions: 28, commission: 1540, color: '#8B5CF6' },
    { name: 'Outros', conversions: 15, commission: 825, color: '#F59E0B' },
  ];

  const handleExportReport = () => {
    // Implementation for exporting reports
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Relatórios de Performance</h2>
        <Button onClick={handleExportReport} className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-surface border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance Geral</SelectItem>
                <SelectItem value="houses">Por Casa de Apostas</SelectItem>
                <SelectItem value="campaigns">Por Campanha</SelectItem>
                <SelectItem value="conversion">Funil de Conversão</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-surface border-white/10",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    "Selecionar período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-white/10" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>

            <Select defaultValue="all">
              <SelectTrigger className="bg-surface border-white/10">
                <SelectValue placeholder="Todas as casas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as casas</SelectItem>
                <SelectItem value="bet365">Bet365</SelectItem>
                <SelectItem value="betano">Betano</SelectItem>
                <SelectItem value="sportingbet">Sportingbet</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="secondary">
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cliques</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalClicks || 0}
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-primary opacity-75" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-secondary mr-1" />
              <span className="text-secondary">+12.5%</span>
              <span className="text-muted-foreground ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversões</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalConversions || 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-secondary opacity-75" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-secondary mr-1" />
              <span className="text-secondary">+8.3%</span>
              <span className="text-muted-foreground ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.totalClicks > 0 
                    ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-accent font-bold">%</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-secondary mr-1" />
              <span className="text-secondary">+2.1%</span>
              <span className="text-muted-foreground ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comissão Total</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {Number(stats?.totalCommission || 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-warning opacity-75" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-secondary mr-1" />
              <span className="text-secondary">+15.7%</span>
              <span className="text-muted-foreground ml-1">vs período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Performance ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B"
                    tickFormatter={(value) => format(new Date(value), "dd/MM", { locale: ptBR })}
                  />
                  <YAxis stroke="#64748B" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => format(new Date(value), "dd/MM/yyyy", { locale: ptBR })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Cliques"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Conversões"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance by House */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-foreground">Performance por Casa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockHousePerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="commission"
                  >
                    {mockHousePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`R$ ${value}`, 'Comissão']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-foreground">Detalhamento por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-foreground">Data</th>
                  <th className="text-left p-4 text-foreground">Cliques</th>
                  <th className="text-left p-4 text-foreground">Conversões</th>
                  <th className="text-left p-4 text-foreground">Taxa</th>
                  <th className="text-left p-4 text-foreground">Comissão</th>
                </tr>
              </thead>
              <tbody>
                {mockPerformanceData.map((row, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="p-4 text-foreground">
                      {format(new Date(row.date), "dd/MM/yyyy", { locale: ptBR })}
                    </td>
                    <td className="p-4 text-foreground">{row.clicks}</td>
                    <td className="p-4 text-foreground">{row.conversions}</td>
                    <td className="p-4 text-foreground">
                      {((row.conversions / row.clicks) * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-foreground">R$ {row.commission.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
