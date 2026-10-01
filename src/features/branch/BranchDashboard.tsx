import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { 
  Package, CheckCircle, Clock, Truck, 
  Navigation, AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import clsx from 'clsx';

const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
  <div className="bg-gray-800 rounded-2xl p-6 flex items-center justify-between shadow-sm border border-gray-700/50">
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
    <div className={clsx('p-3 rounded-xl bg-opacity-20', colorClass, colorClass.replace('text-', 'bg-'))}>
      <Icon className={clsx('w-6 h-6', colorClass)} />
    </div>
  </div>
);

export default function BranchDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['branch-stats'],
    queryFn: () => mockApi.getBranchStats('branch-1'),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['branch-charts'],
    queryFn: () => mockApi.getBranchCharts('branch-1'),
  });

  if (statsLoading || chartLoading) {
    return (
      <div className="p-6 text-gray-400 flex items-center justify-center min-h-[400px]">
        Loading dashboard...
      </div>
    );
  }

  const defaultStats = stats || {
    totalShipments: 0,
    delivered: 0,
    pending: 0,
    inTransit: 0,
    outForDelivery: 0,
    failedAttempts: 0
  };

  const deliveryData = [
    { name: 'Mon', count: 45 },
    { name: 'Tue', count: 52 },
    { name: 'Wed', count: 38 },
    { name: 'Thu', count: 65 },
    { name: 'Fri', count: 48 },
    { name: 'Sat', count: 35 },
    { name: 'Sun', count: 20 },
  ];

  const statusData = [
    { name: 'Delivered', value: defaultStats.delivered },
    { name: 'Not Delivered', value: defaultStats.totalShipments - defaultStats.delivered },
  ];

  const pieColors = ['#22c55e', '#f97316'];

  return (
    <div className="p-4 md:p-6 bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Branch Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Shipments" value={defaultStats.totalShipments} icon={Package} colorClass="text-blue-500" />
        <StatCard title="Delivered" value={defaultStats.delivered} icon={CheckCircle} colorClass="text-green-500" />
        <StatCard title="Pending" value={defaultStats.pending} icon={Clock} colorClass="text-yellow-500" />
        <StatCard title="In Transit" value={defaultStats.inTransit} icon={Truck} colorClass="text-purple-500" />
        <StatCard title="Out for Delivery" value={defaultStats.outForDelivery} icon={Navigation} colorClass="text-orange-500" />
        <StatCard title="Failed Attempts" value={defaultStats.failedAttempts} icon={AlertTriangle} colorClass="text-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deliveries per day */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Deliveries Per Day</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivered vs Not Delivered */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Delivery Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index] }} />
                  <span className="text-gray-400 text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
