import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { mockApi } from '@/services/mockApi';

export default function PaymentCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // The booking data is passed via router state
  const { bookingData, amount } = location.state || {};

  if (!bookingData) {
    return (
      <div className="text-center mt-20 text-white">
        <h2 className="text-2xl font-bold">No Booking Data Found</h2>
        <button onClick={() => navigate('/customer/book')} className="mt-4 text-orange-500">Return to Booking</button>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // In a real app, this creates a payment intent in Stripe/Razorpay, 
      // then after success, creates the shipment on the backend.
      
      const newShipment = {
        trackingId: 'TRK-' + Math.floor(100000 + Math.random() * 900000).toString(),
        packageName: bookingData.packageName,
        senderId: user!.id,
        senderName: user!.name,
        senderAddress: '123 Customer Home Ave', // Mocking for now
        senderPhone: user!.phone || '',
        receiverName: bookingData.receiverName,
        receiverAddress: bookingData.receiverAddress,
        receiverPhone: bookingData.receiverPhone,
        status: 'BOOKED' as const,
        estimatedRevenue: amount,
      };

      // Save to mock database
      const savedShipment = await mockApi.createShipment(newShipment);
      
      setIsSuccess(true);
      toast.success(`Payment successful! Tracking ID: ${savedShipment.trackingId}`);
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">Your courier has been booked. A delivery partner will be assigned shortly.</p>
        <button 
          onClick={() => navigate('/customer')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Checkout</h1>
        <p className="text-gray-400 mt-1">Complete your payment to confirm the booking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
            <CreditCard className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-white">Payment Method</h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Cardholder Name</label>
              <input required className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
              <input required maxLength={19} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 font-mono tracking-widest" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date</label>
                <input required placeholder="MM/YY" maxLength={5} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-center" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                <input required type="password" placeholder="•••" maxLength={4} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-center" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70 flex justify-center items-center"
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pay $${amount.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Invoice Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Package Type</span>
              <span className="text-white font-medium">{bookingData.type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Weight</span>
              <span className="text-white font-medium">{bookingData.weight} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Destination</span>
              <span className="text-white font-medium text-right max-w-[150px] truncate">{bookingData.receiverName}</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 flex justify-between items-center mb-6">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-2xl font-bold text-orange-500">${amount.toFixed(2)}</span>
          </div>

          <div className="bg-gray-950 rounded-xl p-4 text-xs text-gray-500 flex items-center justify-center gap-2">
            🔒 Secure 256-bit SSL Encryption
          </div>
        </div>
      </div>
    </div>
  );
}
