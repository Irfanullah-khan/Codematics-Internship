import React, { useState, useEffect } from 'react';
import { FiSearch, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';

const History = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchMember, setSearchMember] = useState('');
  const [searchBook, setSearchBook] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/issues');
      // The API returns all issues. Sorted by issueDate descending.
      const sortedIssues = data.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
      setIssues(sortedIssues);
    } catch (err) {
      toast.error('Failed to fetch history data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = issues.filter(issue => {
    const memberName = issue.memberId?.name?.toLowerCase() || '';
    const memberId = issue.memberId?.memberId?.toLowerCase() || '';
    const bookTitle = issue.bookId?.title?.toLowerCase() || '';
    const bookId = issue.bookId?.bookId?.toLowerCase() || '';

    const matchesMember = memberName.includes(searchMember.toLowerCase()) || memberId.includes(searchMember.toLowerCase());
    const matchesBook = bookTitle.includes(searchBook.toLowerCase()) || bookId.includes(searchBook.toLowerCase());
    const matchesStatus = statusFilter ? issue.status === statusFilter : true;

    return matchesMember && matchesBook && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Transaction History</h2>
          <p className="text-indigo-100 font-medium">Complete record of all issued and returned books.</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Filter by Member Name or ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white shadow-sm"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Filter by Book Title or ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white shadow-sm"
              value={searchBook}
              onChange={(e) => setSearchBook(e.target.value)}
            />
          </div>
          <select
            className="md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white shadow-sm appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Book Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Member Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Issue Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Expected Return</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">Loading history...</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">No transaction records found.</td></tr>
              ) : (
                filteredHistory.map((issue) => (
                  <tr key={issue._id} className="hover:bg-purple-50/30 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm bg-transparent">
                      <div className="font-semibold text-gray-900 dark:text-white">{issue.bookId?.title || 'Unknown Book'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{issue.bookId?.bookId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm bg-transparent">
                      <div className="font-semibold text-gray-900 dark:text-white">{issue.memberId?.name || 'Unknown Member'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{issue.memberId?.memberId || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium bg-transparent">
                      {new Date(issue.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium bg-transparent">
                      {new Date(issue.returnDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm bg-transparent">
                      {issue.status === 'Active' ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">Active</span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Returned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
