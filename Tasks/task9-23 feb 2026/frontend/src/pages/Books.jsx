import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    bookId: '', title: '', author: '', category: '', quantity: 1
  });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setFormData({
        bookId: book.bookId, title: book.title, author: book.author, category: book.category, quantity: book.quantity
      });
    } else {
      setCurrentBook(null);
      setFormData({ bookId: '', title: '', author: '', category: '', quantity: 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBook) {
        await api.put(`/books/${currentBook._id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/books', formData);
        toast.success('Book added successfully');
      }
      fetchBooks();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Book deleted');
        fetchBooks();
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  };

  const uniqueCategories = [...new Set(books.map(b => b.category))].filter(Boolean);
  const uniqueAuthors = [...new Set(books.map(b => b.author))].filter(Boolean);

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.author.toLowerCase().includes(search.toLowerCase()) ||
                          b.bookId.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? b.category === filterCategory : true;
    const matchesAuthor = filterAuthor ? b.author === filterAuthor : true;
    return matchesSearch && matchesCategory && matchesAuthor;
  });

  return (
    <div className="space-y-8 animate-fade-in relative max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Book Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage library inventory, update quantities, and track availability.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
        >
          <FiPlus className="mr-2 w-5 h-5" /> Add New Book
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search books by title, author, or ID..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm appearance-none cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="md:w-48 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm appearance-none cursor-pointer"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
          >
            <option value="">All Authors</option>
            {uniqueAuthors.map(author => (
              <option key={author} value={author}>{author}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400">Qty / Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : filteredBooks.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">No books found.</td></tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-indigo-50/30 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono bg-transparent">{book.bookId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold bg-transparent">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 bg-transparent">{book.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 bg-transparent">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{book.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm bg-transparent">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-900 dark:text-white font-bold">{book.quantity}</span>
                        {book.availabilityStatus ? 
                          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>In Stock</span>
                          </span> : 
                          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100/50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            <span>Out of Stock</span>
                          </span>
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-transparent">
                      <button onClick={() => handleOpenModal(book)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 transition-colors">
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
                {currentBook ? 'Edit Book Details' : 'Add New Book'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Book ID</label>
                <input 
                  type="text" required 
                  disabled={!!currentBook}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-800 shadow-sm"
                  value={formData.bookId} onChange={e => setFormData({...formData, bookId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Author</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
                  value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Quantity</label>
                  <input 
                    type="number" min="0" required
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
                    value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-xl transition-all font-semibold shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md rounded-xl transition-all font-semibold">
                  {currentBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
