import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbGetAllUsers, dbDeleteUser } from '../services/db';
import { User } from '../types';
import { Trash2, Shield, User as UserIcon, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Security check
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = () => {
      setUsers(dbGetAllUsers());
  };

  const handleDelete = (userId: string) => {
      if(window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
          try {
              dbDeleteUser(userId);
              loadUsers();
          } catch (e: any) {
              setError(e.message);
              setTimeout(() => setError(''), 3000);
          }
      }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="text-red-500" size={32} />
                Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage platform users and permissions.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300">
             Total Users: <span className="text-white font-bold">{users.length}</span>
          </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle size={20} /> {error}
        </div>
      )}

      <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                        <th className="p-4">User</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">ID</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10"/>
                                    <span className="font-medium text-white">{u.username}</span>
                                </div>
                            </td>
                            <td className="p-4 text-gray-400 text-sm">{u.email}</td>
                            <td className="p-4">
                                {u.role === 'admin' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-900/50 text-red-400 text-xs font-bold border border-red-500/20">
                                        <Shield size={12} /> ADMIN
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-400 text-xs font-bold border border-gray-700">
                                        <UserIcon size={12} /> USER
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-gray-600 text-xs font-mono">{u.id}</td>
                            <td className="p-4 text-right">
                                {u.id !== user.id && ( // Cannot delete self
                                    <button 
                                        onClick={() => handleDelete(u.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;