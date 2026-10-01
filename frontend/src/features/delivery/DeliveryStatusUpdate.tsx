import React, { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function DeliveryStatusUpdate() {
  const [selectedStatus, setSelectedStatus] = useState<'DELIVERED' | 'NOT_DELIVERED' | null>(null);
  const [otp, setOtp] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [reason, setReason] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pt-12">
      <div className="mb-8">
        <button className="text-gray-400 mb-4 text-sm font-medium">← Back</button>
        <h1 className="text-2xl font-bold">Update Status</h1>
        <p className="text-gray-400 text-sm mt-1">TRK-990212 • Sarah Connor</p>
      </div>

      {!selectedStatus ? (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedStatus('DELIVERED')}
            className="w-full bg-green-500/10 border-2 border-green-500/30 hover:border-green-500 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <span className="text-xl font-bold text-green-500">Delivered Successfully</span>
          </button>

          <button 
            onClick={() => setSelectedStatus('NOT_DELIVERED')}
            className="w-full bg-red-500/10 border-2 border-red-500/30 hover:border-red-500 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <span className="text-xl font-bold text-red-500">Delivery Failed</span>
          </button>
        </div>
      ) : selectedStatus === 'DELIVERED' ? (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold mb-2">Verify Delivery OTP</h2>
          <p className="text-gray-400 text-sm mb-6">Ask the customer for the 6-digit OTP sent to their mobile number.</p>
          
          <input 
            type="text" 
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-gray-950 border-2 border-gray-800 text-center text-3xl tracking-[1em] font-mono py-4 rounded-xl text-white focus:border-green-500 focus:outline-none mb-4"
          />
          
          <div className="flex justify-between items-center mb-8 text-sm">
            <span className="text-gray-400">Attempts left: <span className="text-white font-bold">{attempts}</span></span>
            <button className="text-orange-500 font-medium">Resend OTP</button>
          </div>

          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-lg shadow-green-500/20 disabled:opacity-50">
            Verify & Complete Delivery
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl animate-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold mb-6">Reason for Failure</h2>
          
          <div className="space-y-4 mb-6">
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500"
            >
              <option value="">Select a reason...</option>
              <option value="CUSTOMER_UNAVAILABLE">Customer Unavailable</option>
              <option value="WRONG_ADDRESS">Wrong Address</option>
              <option value="REFUSED">Refused Delivery</option>
              <option value="DAMAGED_PACKAGE">Damaged Package</option>
              <option value="OTHER">Other</option>
            </select>

            <textarea 
              placeholder="Add optional notes..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 min-h-[120px]"
            />
          </div>

          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-lg shadow-red-500/20">
            Submit Failure Report
          </button>
        </div>
      )}
    </div>
  );
}
