import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import clsx from 'clsx';
import { mockApi } from '@/services/mockApi';
import { Shipment, ShipmentStatus } from '@/types';

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  BOOKED: 'bg-gray-700 text-gray-300',
  PICKED_UP: 'bg-purple-900/50 text-purple-400',
  IN_TRANSIT: 'bg-blue-900/50 text-blue-400',
  AT_BRANCH: 'bg-indigo-900/50 text-indigo-400',
  OUT_FOR_DELIVERY: 'bg-yellow-900/50 text-yellow-400',
  DELIVERED: 'bg-green-900/50 text-green-400',
  FAILED_ATTEMPT: 'bg-red-900/50 text-red-400'
};

export const AllShipments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus[]>([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Mock fetching shipments
  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ['adminShipments'],
    queryFn: async () => {
      // Return dummy data for now
      return Array.from({ length: 45 }).map((_, i) => ({
        id: `ship-${i}`,
        trackingId: `TRK${100000 + i}`,
        packageName: `Package ${i}`,
        senderName: `Sender ${i}`,
        receiverName: `Receiver ${i}`,
        branchName: ['NY Branch', 'LA Branch', 'CHI Branch'][i % 3],
        status: ['BOOKED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_ATTEMPT'][i % 5] as ShipmentStatus,
        assignedPartnerName: i % 2 === 0 ? `Partner ${i}` : undefined,
        bookingDate: new Date(Date.now() - i * 86400000).toISOString(),
        expectedDeliveryDate: new Date(Date.now() + (5-i) * 86400000).toISOString(),
        estimatedRevenue: 15 + i * 2,
      })) as Shipment[];
    }
  });

  const toggleStatus = (status: ShipmentStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter([]);
    setBranchFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(s.status);
    const matchesBranch = branchFilter === '' || s.branchName.includes(branchFilter);
    const matchesDateFrom = dateFrom === '' || new Date(s.bookingDate) >= new Date(dateFrom);
    const matchesDateTo = dateTo === '' || new Date(s.bookingDate) <= new Date(dateTo);
    return matchesSearch && matchesStatus && matchesBranch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const paginatedShipments = filteredShipments.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const exportCSV = () => {
    const headers = ['Tracking ID', 'Package', 'Sender', 'Receiver', 'Branch', 'Status', 'Partner', 'Booking Date', 'Revenue'];
    const csvContent = [
      headers.join(','),
      ...filteredShipments.map(s => 
        [s.trackingId, s.packageName, s.senderName, s.receiverName, s.branchName, s.status, s.assignedPartnerName || 'Unassigned', s.bookingDate, s.estimatedRevenue].join(',')
      )
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courier_shipments_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">All Shipments</h1>
          <p className="text-gray-400 mt-1">Manage and track all shipments system-wide</p>
        </div>
        <button onClick={exportCSV} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center border border-gray-700 transition">
          <Download className="w-4 h-4 mr-2 text-orange-500" />
          Export CSV
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Tracking ID, Sender, Receiver..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-4">
            <input 
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500"
            />
            <span className="text-gray-500 self-center">to</span>
            <input 
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm text-gray-400">Status:</div>
          {(['BOOKED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_ATTEMPT'] as ShipmentStatus[]).map(status => (
            <label key={status} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={statusFilter.includes(status)}
                onChange={() => toggleStatus(status)}
                className="rounded border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 bg-gray-700"
              />
              <span className="text-sm text-gray-300">{status.replace(/_/g, ' ')}</span>
            </label>
          ))}
          <div className="flex-1"></div>
          <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white flex items-center">
            <X className="w-4 h-4 mr-1" /> Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Tracking ID</th>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Sender</th>
                <th className="px-4 py-3 font-medium">Receiver</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Partner</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">Loading shipments...</td>
                </tr>
              ) : paginatedShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">No shipments found.</td>
                </tr>
              ) : (
                paginatedShipments.map((s) => (
                  <tr key={s.id} onClick={() => navigate(`/shipment/${s.id}`)} className="hover:bg-gray-700/50 cursor-pointer transition">
                    <td className="px-4 py-3 font-medium text-orange-400 hover:underline">{s.trackingId}</td>
                    <td className="px-4 py-3 text-gray-300">{s.packageName}</td>
                    <td className="px-4 py-3 text-gray-300">{s.senderName}</td>
                    <td className="px-4 py-3 text-gray-300">{s.receiverName}</td>
                    <td className="px-4 py-3 text-gray-400">{s.branchName}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", STATUS_COLORS[s.status])}>
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{s.assignedPartnerName || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">{format(new Date(s.bookingDate), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3 text-gray-300 font-medium">${s.estimatedRevenue}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
          <div>
            Showing {filteredShipments.length === 0 ? 0 : (page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredShipments.length)} of {filteredShipments.length} filtered entries
            (Total: {shipments.length})
          </div>
          <div className="flex space-x-2">
            <button 
              disabled={page === 1}
              onClick={(e) => { e.stopPropagation(); setPage(p => p - 1); }}
              className="p-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={(e) => { e.stopPropagation(); setPage(p => p + 1); }}
              className="p-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllShipments;
