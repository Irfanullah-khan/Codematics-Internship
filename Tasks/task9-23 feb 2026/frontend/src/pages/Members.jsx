import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterHasBooks, setFilterHasBooks] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    memberId: '', name: '', department: '', contact: ''
  });

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/members');
      setMembers(data);
    } catch (err) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenModal = (member = null) => {
    if (member) {
      setCurrentMember(member);
      setFormData({
        memberId: member.memberId, name: member.name, department: member.department, contact: member.contact
      });
    } else {
      setCurrentMember(null);
      setFormData({ memberId: '', name: '', department: '', contact: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentMember) {
        await api.put(`/members/${currentMember._id}`, formData);
        toast.success('Member updated successfully');
      } else {
        await api.post('/members', formData);
        toast.success('Member added successfully');
      }
      fetchMembers();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save member');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        toast.success('Member deleted');
        fetchMembers();
      } catch (err) {
        toast.error('Failed to delete member');
      }
    }
  };

  const uniqueDepartments = [...new Set(members.map(m => m.department))].filter(Boolean);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.memberId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? m.department === filterDept : true;
    
    let matchesBooks = true;
    if (filterHasBooks === 'yes') matchesBooks = m.issuedBooks.length > 0;
    if (filterHasBooks === 'no') matchesBooks = m.issuedBooks.length === 0;

    return matchesSearch && matchesDept && matchesBooks;
  });

  return (
    <div className="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Member Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage library members, contact details, and current book limits.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 hover:shadow-md transition-all duration-200"
        >
          <FiPlus className="mr-2 w-5 h-5" /> Add New Member
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search members by name or ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white shadow-sm appearance-none cursor-pointer"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            className="md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white shadow-sm appearance-none cursor-pointer"
            value={filterHasBooks}
            onChange={(e) => setFilterHasBooks(e.target.value)}
          >
            <option value="">Holding Books? (All)</option>
            <option value="yes">Yes (Has Books)</option>
            <option value="no">No (0 Books)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Member ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Department/Class</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Books Held</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">No members found.</td></tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-emerald-50/30 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono bg-transparent">{member.memberId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold bg-transparent">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 bg-transparent">{member.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 bg-transparent">{member.contact}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-bold bg-transparent">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">{member.issuedBooks.length}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-transparent">
                      <button onClick={() => handleOpenModal(member)} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentMember ? 'Edit Member Details' : 'Add New Member'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Member ID</label>
                <input 
                  type="text" required 
                  disabled={!!currentMember}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 shadow-sm"
                  value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white shadow-sm"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Department / Class</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white shadow-sm"
                  value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Contact Info</label>
                <input 
                  type="text" required placeholder="Email or Phone"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white shadow-sm"
                  value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})}
                />
              </div>
              
              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-xl transition-all font-semibold shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-md rounded-xl transition-all font-semibold">
                  {currentMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
