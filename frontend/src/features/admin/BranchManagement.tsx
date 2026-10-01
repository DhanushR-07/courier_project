import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, MapPin, Building2, User, Activity, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { Branch } from '@/types';

const branchSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(2, 'Code is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  managerId: z.string().optional()
});

type BranchFormData = z.infer<typeof branchSchema>;

export const BranchManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema)
  });

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ['adminBranches'],
    queryFn: async () => {
      return [
        { id: 'b1', name: 'New York Main', code: 'NY-01', address: '123 Broadway', city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060, isActive: true, createdAt: new Date().toISOString() },
        { id: 'b2', name: 'Los Angeles Hub', code: 'LA-01', address: '456 Hollywood Blvd', city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437, isActive: true, createdAt: new Date().toISOString() },
      ] as Branch[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      return data;
    },
    onSuccess: () => {
      toast.success(editingBranch ? 'Branch updated' : 'Branch created');
      setIsModalOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['adminBranches'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return id;
    },
    onSuccess: () => {
      toast.success('Branch deleted');
      setConfirmDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['adminBranches'] });
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      return { id, isActive };
    },
    onSuccess: () => {
      toast.success('Branch status updated');
      queryClient.invalidateQueries({ queryKey: ['adminBranches'] });
    }
  });

  const openModal = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      reset({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        lat: branch.lat,
        lng: branch.lng,
        managerId: branch.managerId || ''
      });
    } else {
      setEditingBranch(null);
      reset({ lat: 0, lng: 0 });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Branch Management</h1>
          <p className="text-gray-400 mt-1">Manage physical locations and hubs</p>
        </div>
        <button onClick={() => openModal()} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl flex items-center transition">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-800 rounded-2xl animate-pulse border border-gray-700"></div>)
        ) : branches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">No branches found.</div>
        ) : (
          branches.map((b) => (
            <div key={b.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-6 flex flex-col relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-900 rounded-xl mr-4 border border-gray-700">
                    <Building2 className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center">
                      {b.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">{b.code}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(b)} className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setConfirmDeleteId(b.id)} className="p-1.5 bg-red-900/50 hover:bg-red-900 text-red-400 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 mt-2 flex-grow">
                <div className="flex items-start text-sm text-gray-300">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                  <span>{b.address}<br/>{b.city}, {b.state}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{b.managerId ? 'Manager Assigned' : 'No Manager'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Activity className="w-4 h-4 mr-2 text-gray-500" />
                  <span>1,245 Shipments</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className={clsx("text-xs font-medium px-2 py-1 rounded-full", b.isActive ? "bg-green-900/50 text-green-400" : "bg-gray-700 text-gray-400")}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
                <button 
                  onClick={() => toggleStatusMutation.mutate({ id: b.id, isActive: !b.isActive })}
                  className={clsx(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                    b.isActive ? "bg-orange-500" : "bg-gray-600"
                  )}
                >
                  <span className={clsx("inline-block h-3 w-3 transform rounded-full bg-white transition-transform", b.isActive ? "translate-x-5" : "translate-x-1")} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl border border-gray-700 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{editingBranch ? 'Edit Branch' : 'Add Branch'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input {...register('name')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Code</label>
                  <input {...register('code')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                <input {...register('address')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input {...register('city')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <input {...register('state')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                  <input type="number" step="any" {...register('lat')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.lat && <p className="text-red-400 text-xs mt-1">{errors.lat.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                  <input type="number" step="any" {...register('lng')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.lng && <p className="text-red-400 text-xs mt-1">{errors.lng.message}</p>}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl transition disabled:opacity-50">
                  {saveMutation.isPending ? 'Saving...' : 'Save Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-700 text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Delete Branch?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone. Are you sure you want to proceed?</p>
            <div className="flex justify-center space-x-3">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmDeleteId)} disabled={deleteMutation.isPending} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl transition">
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
