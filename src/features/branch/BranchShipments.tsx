import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { Search, Download, MoreVertical, X } from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types';
import { format } from 'date-fns';

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    BOOKED: 'bg-blue-500/20 text-blue-400',
    PICKED_UP: 'bg-indigo-500/20 text-indigo-400',
    IN_TRANSIT: 'bg-purple-500/20 text-purple-400',
    AT_BRANCH: 'bg-gray-500/20 text-gray-400',
    OUT_FOR_DELIVERY: 'bg-orange-500/20 text-orange-400',
    DELIVERED: 'bg-green-500/20 text-green-400',
    FAILED_ATTEMPT: 'bg-red-500/20 text-red-400',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default function BranchShipments() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalType, setModalType] = useState<'STATUS' | 'PARTNER' | 'TIMELINE' | null>(null);
  
  const { data: shipments, isLoading } = useQuery({
    queryKey: ['branch-shipments'],
    queryFn: () => mockApi.getShipments({ branchId: 'branch-1' }),
  });

  const handleExportCsv = () => {
    // Generate simple CSV
    if (!shipments) return;
    const header = "Tracking ID,Package,Receiver,Status,Partner,Date\n";
    const csv = shipments.map((s: Shipment) => `${s.trackingId},${s.packageName},${s.receiverName},${s.status},${s.assignedPartnerName || 'Unassigned'},${s.bookingDate}`).join("\n");
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipments.csv';
    a.click();
  };

  const filtered = shipments?.filter((s: Shipment) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search && !s.trackingId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-950 min-h-screen text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Branch Shipments</h1>
        <button 
          onClick={handleExportCsv}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition-colors border border-gray-700"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-2xl mb-6 flex flex-wrap gap-4 border border-gray-700/50">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search tracking ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="AT_BRANCH">At Branch</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED_ATTEMPT">Failed Attempt</option>
        </select>
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700/50 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading shipments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 border-b border-gray-700">
                  <th className="px-6 py-4 font-medium text-gray-400">Tracking ID</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Package</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Receiver</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Partner</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Date</th>
                  <th className="px-6 py-4 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.map((shipment: Shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{shipment.trackingId}</td>
                    <td className="px-6 py-4">{shipment.packageName}</td>
                    <td className="px-6 py-4">{shipment.receiverName}</td>
                    <td className="px-6 py-4"><StatusBadge status={shipment.status} /></td>
                    <td className="px-6 py-4">{shipment.assignedPartnerName || <span className="text-gray-500">Unassigned</span>}</td>
                    <td className="px-6 py-4">{format(new Date(shipment.bookingDate), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setSelectedShipment(shipment); setModalType('STATUS'); }}
                          className="text-sm bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300"
                        >
                          Status
                        </button>
                        <button 
                          onClick={() => { setSelectedShipment(shipment); setModalType('PARTNER'); }}
                          className="text-sm bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300"
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No shipments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {modalType === 'STATUS' && 'Update Status'}
                {modalType === 'PARTNER' && 'Assign Partner'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {modalType === 'STATUS' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">New Status</label>
                    <select className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                      <option>OUT_FOR_DELIVERY</option>
                      <option>AT_BRANCH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Note (Optional)</label>
                    <textarea 
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 min-h-[100px]"
                      placeholder="Add a note..."
                    />
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors">
                    Update Status
                  </button>
                </div>
              )}
              {modalType === 'PARTNER' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {['John Doe', 'Jane Smith', 'Mike Johnson'].map(partner => (
                      <label key={partner} className="flex items-center gap-3 p-3 rounded-xl border border-gray-700 hover:bg-gray-700/50 cursor-pointer">
                        <input type="radio" name="partner" className="text-orange-500 focus:ring-orange-500 bg-gray-900 border-gray-600" />
                        <span className="text-white">{partner}</span>
                      </label>
                    ))}
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors mt-4">
                    Confirm Assignment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
