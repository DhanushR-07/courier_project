import React, { useState } from 'react';
import { Check, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/services/mockApi';
import { toast } from 'react-hot-toast';
import { OtpInput } from '@/components/shared/OtpInput';

export default function DeliveryStatusUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<'DELIVERED' | 'NOT_DELIVERED' | null>(null);
  const [otp, setOtp] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => mockApi.getShipmentById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ status, otpCode }: { status: 'DELIVERED' | 'FAILED_ATTEMPT', otpCode?: string }) => {
      if (status === 'DELIVERED') {
        const isValid = await mockApi.verifyOtp(id!, otpCode!);
        if (!isValid) throw new Error('Invalid OTP');
      }
      return mockApi.updateShipmentStatus(id!, status, notes ? `${reason}: ${notes}` : reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryShipments'] });
      queryClient.invalidateQueries({ queryKey: ['shipment', id] });
      toast.success('Status updated successfully');
      navigate('/delivery');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
      if (selectedStatus === 'DELIVERED') {
        setAttempts(a => Math.max(0, a - 1));
      }
    }
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  if (!shipment) {
    return <div className="min-h-screen bg-gray-950 text-white p-4">Shipment not found.</div>;
  }

  const handleVerifyDelivery = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    if (attempts <= 0) {
      toast.error('No attempts left. Please mark as failed.');
      return;
    }
    updateMutation.mutate({ status: 'DELIVERED', otpCode: otp });
  };

  const handleFailDelivery = () => {
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }
    updateMutation.mutate({ status: 'FAILED_ATTEMPT' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pt-12">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 mb-4 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold">Update Status</h1>
        <p className="text-gray-400 text-sm mt-1">{shipment.trackingId} • {shipment.receiverName}</p>
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
          
          <OtpInput 
            length={6}
            isLoading={updateMutation.isPending}
            error={attempts < 3 && attempts > 0 ? 'Invalid OTP. Please try again.' : ''}
            attemptsLeft={attempts}
            onComplete={(code) => {
              if (attempts <= 0) {
                toast.error('No attempts left. Please mark as failed.');
                return;
              }
              updateMutation.mutate({ status: 'DELIVERED', otpCode: code });
            }}
          />
          
          <p className="text-xs text-gray-600 text-center mt-6">
            Demo Hint: The OTP is {shipment.deliveryOtp || '123456'}
          </p>
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add optional notes..."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 min-h-[120px]"
            />
          </div>

          <button 
            onClick={handleFailDelivery}
            disabled={updateMutation.isPending}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-lg shadow-red-500/20 flex justify-center items-center"
          >
            {updateMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Failure Report"}
          </button>
        </div>
      )}
    </div>
  );
}
