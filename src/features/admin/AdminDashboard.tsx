import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { Package, CheckCircle, Clock, DollarSign, Users, Building, ArrowRight, UserPlus, MapPin, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { mockApi } from '@/services/mockApi';
import { DashboardStats } from '@/types';

// Placeholder mockApi functions if not already present
// In a real app, these would be exported from mockApi
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  return {
    totalShipments: 12540,
    delivered: 8432,
    pending: 4108,
    inTransit: 2100,
    outForDelivery: 1200,
    failedAttempts: 808,
    activePartners: 145,
    totalRevenue: 345000,
  };
};

const fetchDeliveryTrends = async () => {
  return Array.from({ length: 14 }).map((_, i) => ({
    name: `Day ${i + 1}`,
    delivered: Math.floor(Math.random() * 500) + 200,
  }));
};

const fetchBranchRevenue = async () => {
  return [
    { name: 'NY Branch', value: 45000 },
    { name: 'LA Branch', value: 38000 },
    { name: 'CHI Branch', value: 32000 },
    { name: 'TX Branch', value: 28000 },
    { name: 'MIA Branch', value: 25000 },
  ];
};

const fetchTopPartners = async () => {
  return [
    { name: 'John Doe', deliveries: 145 },
    { name: 'Jane Smith', deliveries: 132 },
    { name: 'Mike Ross', deliveries: 128 },
    { name: 'Sarah Lee', deliveries: 115 },
    { name: 'Tom Hardy', deliveries: 102 },
  ];
};

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: any, colorClass: string }) => (
  <div className="bg-gray-800 p-6 rounded-2xl flex items-center space-x-4 border border-gray-700">
    <div className={clsx("p-3 rounded-xl", colorClass)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchDashboardStats
  });

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['deliveryTrends'],
    queryFn: fetchDeliveryTrends
  });

  const { data: branchRevenue, isLoading: branchLoading } = useQuery({
    queryKey: ['branchRevenue'],
    queryFn: fetchBranchRevenue
  });

  const { data: topPartners, isLoading: partnersLoading } = useQuery({
    queryKey: ['topPartners'],
    queryFn: fetchTopPartners
  });

  const pieData = stats ? [
    { name: 'Delivered', value: stats.delivered, color: '#10B981' }, // Green
    { name: 'In Transit', value: stats.inTransit, color: '#3B82F6' }, // Blue
    { name: 'Out for Delivery', value: stats.outForDelivery, color: '#F59E0B' }, // Yellow
    { name: 'Failed', value: stats.failedAttempts, color: '#EF4444' }, // Red
  ] : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Global Dashboard</h1>
          <p className="text-gray-400 mt-1">Overview of system performance</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/users" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center border border-gray-700 transition">
            <UserPlus className="w-4 h-4 mr-2 text-orange-500" />
            Add User
          </Link>
          <Link to="/admin/branches" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center border border-gray-700 transition">
            <Building className="w-4 h-4 mr-2 text-orange-500" />
            Add Branch
          </Link>
          <Link to="/admin/shipments" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl flex items-center transition">
            <Package className="w-4 h-4 mr-2" />
            View All Shipments
          </Link>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Total Shipments" value={stats.totalShipments.toLocaleString()} icon={Package} colorClass="bg-blue-600" />
          <StatCard title="Delivered" value={stats.delivered.toLocaleString()} icon={CheckCircle} colorClass="bg-green-600" />
          <StatCard title="Pending" value={stats.pending.toLocaleString()} icon={Clock} colorClass="bg-yellow-600" />
          <StatCard title="Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} colorClass="bg-orange-600" />
          <StatCard title="Active Partners" value={stats.activePartners} icon={Users} colorClass="bg-purple-600" />
          <StatCard title="Total Branches" value="45" icon={Building} colorClass="bg-pink-600" />
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Delivery Trends (14 Days)</h2>
          {trendsLoading ? <div className="h-64 animate-pulse bg-gray-700 rounded-xl"></div> : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
                    itemStyle={{ color: '#F97316' }}
                  />
                  <Area type="monotone" dataKey="delivered" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorDelivered)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Status Breakdown</h2>
          {statsLoading ? <div className="h-64 animate-pulse bg-gray-700 rounded-xl"></div> : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center text-sm text-gray-400">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue by Branch</h2>
          {branchLoading ? <div className="h-64 animate-pulse bg-gray-700 rounded-xl"></div> : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <RechartsTooltip 
                    cursor={{fill: '#374151'}}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Top Performing Partners</h2>
          {partnersLoading ? <div className="h-64 animate-pulse bg-gray-700 rounded-xl"></div> : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPartners} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <RechartsTooltip 
                    cursor={{fill: '#374151'}}
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem', color: '#fff' }}
                  />
                  <Bar dataKey="deliveries" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
