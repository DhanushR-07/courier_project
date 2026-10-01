import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ShieldAlert, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { AuditLog } from '@/types';

const ACTION_COLORS: Record<string, string> = {
  'USER_LOGIN': 'bg-blue-900/50 text-blue-400',
  'SHIPMENT_CREATED': 'bg-green-900/50 text-green-400',
  'SHIPMENT_UPDATED': 'bg-indigo-900/50 text-indigo-400',
  'USER_CREATED': 'bg-purple-900/50 text-purple-400',
  'USER_UPDATED': 'bg-purple-900/50 text-purple-400',
  'BRANCH_CREATED': 'bg-orange-900/50 text-orange-400',
  'DELETE': 'bg-red-900/50 text-red-400',
};

export const AuditLogViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      // Mock data
      return Array.from({ length: 50 }).map((_, i) => ({
        id: `log-${i}`,
        userId: `usr-${i%5}`,
        userName: ['Admin', 'John Manager', 'System', 'API User'][i%4],
        action: ['USER_LOGIN', 'SHIPMENT_CREATED', 'SHIPMENT_UPDATED', 'USER_CREATED', 'DELETE'][i%5],
        resource: ['Auth', 'Shipment', 'Shipment', 'User', 'Branch'][i%5],
        resourceId: `res-${100+i}`,
        details: `Action performed on resource ${100+i}. IP: 192.168.1.${i%255}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString()
      })) as AuditLog[];
    }
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === '' || log.action === actionFilter;
    const matchesDateFrom = dateFrom === '' || new Date(log.timestamp) >= new Date(dateFrom);
    const matchesDateTo = dateTo === '' || new Date(log.timestamp) <= new Date(dateTo);
    return matchesSearch && matchesAction && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const actions = Array.from(new Set(logs.map(l => l.action)));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ShieldAlert className="w-8 h-8 mr-3 text-orange-500" />
            System Audit Log
          </h1>
          <p className="text-gray-400 mt-1">Track system events, changes, and user activities</p>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl flex items-center border border-gray-700 transition">
          <Download className="w-4 h-4 mr-2 text-orange-500" />
          Export Logs
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users or details..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <select 
          value={actionFilter} 
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Actions</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <div className="flex gap-2 items-center">
           <input 
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500"
          />
          <span className="text-gray-500">-</span>
          <input 
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-gray-300 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Resource</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading logs...</td></tr>
              ) : paginatedLogs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No logs found.</td></tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-750 transition font-mono text-xs">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-4 py-3 text-white">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase", ACTION_COLORS[log.action] || 'bg-gray-700 text-gray-300')}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{log.resource} <span className="text-gray-500">({log.resourceId})</span></td>
                    <td className="px-4 py-3 text-gray-400 max-w-md truncate" title={log.details}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400">
          <div>
            Showing {filteredLogs.length === 0 ? 0 : (page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
          </div>
          <div className="flex space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-700 disabled:opacity-50 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogViewer;
