import React, { useState, useEffect, useRef } from 'react';
import { FiRefreshCcw, FiCheckCircle, FiChevronDown, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border ${isOpen ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl cursor-pointer flex justify-between items-center transition-all shadow-sm`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block truncate ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 font-normal'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
          <div className="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-orange-500 dark:text-white text-sm shadow-sm transition-colors"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1 overscroll-contain">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div 
                  key={option.value}
                  className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${option.value === value ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => {
                    onChange({ target: { value: option.value } });
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchIssue, setSearchIssue] = useState('');
  
  // Issue Form State
  const [formData, setFormData] = useState({ bookId: '', memberId: '', returnDate: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesRes, booksRes, membersRes] = await Promise.all([
        api.get('/issues'),
        api.get('/books'),
        api.get('/members')
      ]);
      setIssues(issuesRes.data);
      setBooks(booksRes.data.filter(b => b.availabilityStatus));
      setMembers(membersRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!formData.bookId || !formData.memberId || !formData.returnDate) {
      return toast.error('Please fill all fields');
    }
    
    try {
      await api.post('/issues/issue', formData);
      toast.success('Book issued successfully');
      setFormData({ bookId: '', memberId: '', returnDate: '' });
      fetchData(); // Refresh Data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (issueId) => {
    if (window.confirm('Are you sure you want to mark this book as returned?')) {
      try {
        const { data } = await api.post(`/issues/return/${issueId}`);
        if (data.fine > 0) {
          toast.success(`Book returned with a late fine of Rs. ${data.fine}`);
        } else {
          toast.success('Book returned successfully with no fine!');
        }
        fetchData(); // Refresh Data
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to return book');
      }
    }
  };

  const filteredActiveIssues = issues.filter(i => {
    if (i.status !== 'Active') return false;
    if (!searchIssue) return true;
    
    const searchLower = searchIssue.toLowerCase();
    const bookTitle = i.bookId?.title?.toLowerCase() || '';
    const bookId = i.bookId?.bookId?.toLowerCase() || '';
    const memberName = i.memberId?.name?.toLowerCase() || '';
    const memberId = i.memberId?.memberId?.toLowerCase() || '';
    
    return bookTitle.includes(searchLower) || 
           bookId.includes(searchLower) || 
           memberName.includes(searchLower) || 
           memberId.includes(searchLower);
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-500 to-orange-600 p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Issue & Return Console</h2>
          <p className="text-orange-100 font-medium">Manage book circulation, track active issues, and process returns.</p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Issue Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mr-3">
                <FiRefreshCcw className="text-orange-600 dark:text-orange-400" />
              </span>
              New Issue
            </h3>
            <form onSubmit={handleIssueBook} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Book</label>
                <SearchableSelect 
                  options={books.map(b => ({ value: b._id, label: `${b.title} (${b.bookId}) - ${b.quantity} left` }))}
                  value={formData.bookId}
                  onChange={e => setFormData({...formData, bookId: e.target.value})}
                  placeholder="-- Search & Choose a Book --"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Member</label>
                <SearchableSelect 
                  options={members.map(m => ({ value: m._id, label: `${m.name} (${m.memberId})` }))}
                  value={formData.memberId}
                  onChange={e => setFormData({...formData, memberId: e.target.value})}
                  placeholder="-- Search & Choose a Member --"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Expected Return Date</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all dark:text-white shadow-sm"
                  value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 mt-4 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                Issue Book
              </button>
            </form>
          </div>
        </div>

        {/* Active Issues Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Active Issues</h3>
                 <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600">
                   {issues.filter(i => i.status === 'Active').length} Total Active
                 </span>
               </div>
               <div className="relative w-full sm:w-64">
                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                 <input 
                   type="text" 
                   placeholder="Search issues..."
                   className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all dark:text-white text-sm shadow-sm"
                   value={searchIssue}
                   onChange={(e) => setSearchIssue(e.target.value)}
                 />
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Book</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Member</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Dates</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredActiveIssues.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400 font-medium">No active issues found matching your search.</td></tr>
                  ) : (
                    filteredActiveIssues.map((issue) => {
                      const isOverdue = new Date(issue.returnDate) < new Date();
                      
                      return (
                        <tr key={issue._id} className="hover:bg-orange-50/30 dark:hover:bg-gray-800/50 transition-colors group">
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold bg-transparent">
                            {issue.bookId?.title || 'Unknown Book'}
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{issue.bookId?.bookId}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold bg-transparent">
                            {issue.memberId?.name || 'Unknown Member'}
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{issue.memberId?.memberId}</div>
                          </td>
                          <td className="px-6 py-4 text-sm bg-transparent">
                            <div className="text-gray-700 dark:text-gray-300">
                              <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mr-1">Out:</span> 
                              {new Date(issue.issueDate).toLocaleDateString()}
                            </div>
                            <div className={`mt-1 font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mr-1">Due:</span>
                              {new Date(issue.returnDate).toLocaleDateString()}
                              {isOverdue && <span className="ml-2 text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">OVERDUE</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-right bg-transparent">
                            <button 
                              onClick={() => handleReturnBook(issue._id)} 
                              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                            >
                              Return Book
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;
