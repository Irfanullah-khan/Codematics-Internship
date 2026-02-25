import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiAlertCircle, FiCheckCircle, FiBookOpen, FiClock, FiPlus } from 'react-icons/fi';
import api from '../api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeIssues: 0,
    overdueIssues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [booksRes, membersRes, issuesRes] = await Promise.all([
          api.get('/books'),
          api.get('/members'),
          api.get('/issues')
        ]);

        const books = booksRes.data;
        const members = membersRes.data;
        const issues = issuesRes.data;

        const active = issues.filter(i => i.status === 'Active');
        
        const now = new Date();
        const overdue = active.filter(i => new Date(i.returnDate) < now);

        setStats({
          totalBooks: books.reduce((acc, curr) => acc + curr.quantity, 0),
          totalMembers: members.length,
          activeIssues: active.length,
          overdueIssues: overdue.length
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Books', value: stats.totalBooks, icon: <FiBook className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-100 dark:bg-blue-900/40' },
    { label: 'Total Members', value: stats.totalMembers, icon: <FiUsers className="w-8 h-8 text-green-500" />, bg: 'bg-green-100 dark:bg-green-900/40' },
    { label: 'Active Issues', value: stats.activeIssues, icon: <FiCheckCircle className="w-8 h-8 text-yellow-500" />, bg: 'bg-yellow-100 dark:bg-yellow-900/40' },
  // Removed statCards array as it's no longer used
  ];

  if (loading) return <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FiBookOpen className="w-8 h-8 text-indigo-100" />}
          title="Total Books"
          value={stats.totalBooks}
          color="bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-indigo-500/30"
          delay="0"
        />
        <StatCard 
          icon={<FiUsers className="w-8 h-8 text-emerald-100" />}
          title="Total Members"
          value={stats.totalMembers}
          color="bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/30"
          delay="100"
        />
        <StatCard 
          icon={<FiBook className="w-8 h-8 text-amber-100" />}
          title="Issued Books"
          value={stats.activeIssues}
          color="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
          delay="200"
        />
        <StatCard 
          icon={<FiClock className="w-8 h-8 text-rose-100" />}
          title="Overdue Returns"
          value={stats.overdueCount}
          color="bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-500/30"
          delay="300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
              <FiBookOpen className="text-indigo-600 dark:text-indigo-400" />
            </span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/issues" className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-all duration-200 group shadow-sm hover:shadow-md transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <FiBook className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Issue Book</span>
            </Link>
            <Link to="/books" className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-800 transition-all duration-200 group shadow-sm hover:shadow-md transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <FiPlus className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Add Book</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-2xl shadow-lg relative overflow-hidden text-white">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">System Status</h3>
            <p className="text-indigo-100 leading-relaxed mb-6 font-medium">All systems are running smoothly. The database is synced and up to date. Keep up the good work managing the library!</p>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2 animate-pulse shadow-lg shadow-emerald-400"></div>
              <span className="font-semibold tracking-wide text-sm text-indigo-50">Online</span>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, delay }) => {
  return (
    <div 
      className={`p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-lg border border-white/10 dark:border-gray-700/50 ${color}`}
      style={{ animationDuration: '0.5s', animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl shadow-inner shadow-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-right">
          <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider">{title}</h4>
          <p className="text-3xl font-black text-white mt-1 tracking-tight drop-shadow-sm">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
