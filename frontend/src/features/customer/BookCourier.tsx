import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, MapPin, Scale, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const bookingSchema = z.object({
  receiverName: z.string().min(2, 'Receiver name is required'),
  receiverPhone: z.string().min(10, 'Valid phone number required'),
  receiverAddress: z.string().min(10, 'Full address is required'),
  packageName: z.string().min(2, 'Package name is required'),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  type: z.enum(['STANDARD', 'EXPRESS', 'OVERNIGHT']),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function BookCourier() {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { type: 'STANDARD', weight: 1 }
  });

  const weight = watch('weight');
  const type = watch('type');

  // Calculate pricing dynamically
  React.useEffect(() => {
    let base = 10;
    if (type === 'EXPRESS') base += 15;
    if (type === 'OVERNIGHT') base += 30;
    setPricing(base + ((weight || 1) * 2.5));
  }, [weight, type]);

  const onSubmit = (data: BookingForm) => {
    // Navigate to payment page and pass the booking data via router state
    navigate('/customer/payment', { 
      state: { 
        bookingData: data, 
        amount: pricing 
      } 
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Book a Courier</h1>
        <p className="text-gray-400 mt-1">Enter shipment details to get a quote and arrange pickup.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Package Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <Package className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-white">Package Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Package Contents / Name</label>
              <input 
                {...register('packageName')} 
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                placeholder="e.g. Electronics, Documents"
              />
              {errors.packageName && <p className="text-red-500 text-xs mt-1">{errors.packageName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Weight (kg)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scale className="w-4 h-4 text-gray-500" />
                </div>
                <input 
                  type="number" step="0.1"
                  {...register('weight', { valueAsNumber: true })} 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                />
              </div>
              {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
            </div>
          </div>
        </div>

        {/* Destination Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-white">Destination Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Receiver Name</label>
              <input 
                {...register('receiverName')} 
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
              />
              {errors.receiverName && <p className="text-red-500 text-xs mt-1">{errors.receiverName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Receiver Phone</label>
              <input 
                {...register('receiverPhone')} 
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
              />
              {errors.receiverPhone && <p className="text-red-500 text-xs mt-1">{errors.receiverPhone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Delivery Address</label>
              <textarea 
                {...register('receiverAddress')} 
                rows={3}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
              />
              {errors.receiverAddress && <p className="text-red-500 text-xs mt-1">{errors.receiverAddress.message}</p>}
            </div>
          </div>
        </div>

        {/* Shipping Speed */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <Truck className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-white">Delivery Speed</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['STANDARD', 'EXPRESS', 'OVERNIGHT'].map((option) => (
              <label 
                key={option} 
                className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-colors ${type === option ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 bg-gray-950 hover:border-gray-700'}`}
              >
                <input type="radio" value={option} {...register('type')} className="hidden" />
                <span className="font-bold text-white mb-1">{option}</span>
                <span className="text-xs text-gray-400">
                  {option === 'STANDARD' && '3-5 Business Days'}
                  {option === 'EXPRESS' && '1-2 Business Days'}
                  {option === 'OVERNIGHT' && 'Next Day Delivery'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="bg-orange-500/10 border-2 border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Estimated Total</p>
            <p className="text-3xl font-bold text-white">${pricing.toFixed(2)}</p>
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-orange-500/20"
          >
            Proceed to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
