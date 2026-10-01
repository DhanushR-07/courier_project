import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit, Shield, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { mockApi } from '@/services/mockApi';
import { User, UserRole } from '@/types';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['CUSTOMER', 'ADMIN', 'BRANCH_STAFF', 'DELIVERY_PARTNER']),
  branchId: z.string().optional()
});

type UserFormData = z.infer<typeof userSchema>;

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-900/50 text-red-400',
  BRANCH_STAFF: 'bg-indigo-900/50 text-indigo-400',
  DELIVERY_PARTNER: 'bg-orange-900/50 text-orange-400',
  CUSTOMER: 'bg-blue-900/50 text-blue-400'
};

export const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const selectedRole = watch('role');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      return [
        { id: '1', name: 'Admin User', email: 'admin@courier.com', phone: '1234567890', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString() },
        { id: '2', name: 'John Staff', email: 'john@courier.com', phone: '1234567891', role: 'BRANCH_STAFF', branchId: 'NY1', isActive: true, createdAt: new Date().toISOString() },
        { id: '3', name: 'Mike Driver', email: 'mike@courier.com', phone: '1234567892', role: 'DELIVERY_PARTNER', isActive: false, createdAt: new Date().toISOString() },
      ] as User[];
    }
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      // Mock toggle
      return { id, isActive };
    },
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const saveUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      // Mock save
      return data;
    },
    onSuccess: () => {
      toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
      setIsModalOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        branchId: user.branchId || ''
      });
    } else {
      setEditingUser(null);
      reset({ role: 'CUSTOMER' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data: UserFormData) => {
    saveUserMutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage system users, staff, and partners</p>
        </div>
        <button onClick={() => openModal()} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl flex items-center transition">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="BRANCH_STAFF">Branch Staff</option>
          <option value="DELIVERY_PARTNER">Delivery Partner</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found.</td></tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-700/50 transition">
                    <td className="px-4 py-3 text-white font-medium">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3 text-xs font-bold">
                          {u.name.substring(0,2).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={clsx("px-2 py-1 rounded-full text-xs font-medium", ROLE_COLORS[u.role])}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.branchId || '-'}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => toggleStatusMutation.mutate({ id: u.id, isActive: !u.isActive })}
                        className={clsx(
                          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                          u.isActive ? "bg-orange-500" : "bg-gray-600"
                        )}
                      >
                        <span className={clsx(
                          "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                          u.isActive ? "translate-x-5" : "translate-x-1"
                        )} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openModal(u)} className="p-2 text-gray-400 hover:text-orange-500 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md shadow-xl border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input {...register('name')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input type="email" {...register('email')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input {...register('phone')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <input type="password" {...register('password')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select {...register('role')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500">
                  <option value="CUSTOMER">Customer</option>
                  <option value="DELIVERY_PARTNER">Delivery Partner</option>
                  <option value="BRANCH_STAFF">Branch Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {selectedRole === 'BRANCH_STAFF' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
                  <select {...register('branchId')} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-orange-500">
                    <option value="">Select Branch</option>
                    <option value="NY1">New York</option>
                    <option value="LA1">Los Angeles</option>
                  </select>
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={saveUserMutation.isPending} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl transition disabled:opacity-50">
                  {saveUserMutation.isPending ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
