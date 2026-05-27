import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Database,
  Trash2,
  X,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard({ currentTheme }: any) {
  const [users, setUsers] = useState<any[]>([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userActivities, setUserActivities] = useState<any[]>([]);
  const [systemTransactions, setSystemTransactions] = useState<any[]>([]);

  // Fetch the admin user list and all system transactions on initial load.
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userStorage = localStorage.getItem('expense_user');
        const token = userStorage ? JSON.parse(userStorage).token : '';

        if (!token) {
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        };

        const [usersRes, txRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users', {
            method: 'GET',
            headers
          }),
          fetch('http://localhost:5000/api/admin/all-transactions', {
            method: 'GET',
            headers
          })
        ]);

        if (usersRes.ok) {
          const userData = await usersRes.json();
          setUsers(userData);
        }

        if (txRes.ok) {
          const txData = await txRes.json();
          setSystemTransactions(txData);
        }
      } catch (error) {
        console.error('Admin pre-fetch dashboard data failed:', error);
      }
    };

    fetchAdminData();
  }, []);

  // Count all transactions across the system.
  const totalSystemTransactionsCount = systemTransactions.length;

  // Sum all expense transactions for the system-wide money flow metric.
  const totalSystemFlow = systemTransactions
    .filter((t: any) => t.type === 'expense')
    .reduce(
      (sum: number, t: any) => sum + (Number(t.amount) || 0),
      0
    );

  // Delete a normal user and remove their transactions from local admin state.
  const handleDeleteUser = async (id: string) => {
    if (
      window.confirm(
        'ARE YOU SURE? This will delete the user AND all their transactions!'
      )
    ) {
      try {
        const userStorage = localStorage.getItem('expense_user');
        const token = userStorage ? JSON.parse(userStorage).token : '';

        if (!token) {
          alert('Session expired. Please login again.');
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/admin/users/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((u) => u._id !== id)
          );

          setSystemTransactions((prevTransactions) =>
            prevTransactions.filter(
              (t: any) => String(t.userId) !== String(id)
            )
          );

          alert('User deleted from the system.');
        } else {
          const data = await res.json();
          alert(`Delete failed: ${data.message || 'Unauthorized'}`);
        }
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Network error, connection failed.');
      }
    }
  };

  // Fetch and display the selected user's transaction history.
  const handleViewUserActivity = async (user: any) => {
    setSelectedUser(user);
    setIsActivityModalOpen(true);
    setUserActivities([]);

    const userStorage = localStorage.getItem('expense_user');
    const token = userStorage ? JSON.parse(userStorage).token : '';

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${user._id}/activities`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUserActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch user activity', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto mt-14 animate-fadeIn">
      {/* Dashboard header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Control Center
          </h1>

          <p className="text-gray-500">
            System overview and user management
          </p>
        </div>
      </div>

      {/* System metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${currentTheme.primary}20`,
              color: currentTheme.primary
            }}
          >
            <Users className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Registered Users
            </p>

            <p className="text-2xl font-bold">
              {users.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total System Transactions
            </p>

            <p className="text-2xl font-bold">
              {totalSystemTransactionsCount}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold">
              $
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Money Flow
            </p>

            <p className="text-2xl font-bold">
              ${totalSystemFlow.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* User database table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">
            User Database
          </h2>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium text-gray-500">
                Name
              </th>

              <th className="p-4 font-medium text-gray-500">
                Email
              </th>

              <th className="p-4 font-medium text-gray-500">
                Role
              </th>

              <th className="p-4 font-medium text-gray-500">
                Joined Date
              </th>

              <th className="p-4 font-medium text-gray-500 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td
                  className="p-4 font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-all"
                  onClick={() => handleViewUserActivity(user)}
                  title="Click to view history"
                >
                  {user.name}
                </td>

                <td className="p-4 text-gray-600">
                  {user.email}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </td>

                <td className="p-4 text-gray-500">
                  {user.createdAt
                    ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                    : 'N/A'}
                </td>

                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected user activity modal */}
      {isActivityModalOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fadeIn"
          onClick={() => setIsActivityModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-[650px] max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2
                    className="text-xl font-bold text-gray-900 tracking-tight"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif'
                    }}
                  >
                    Activity History
                  </h2>

                  <p className="text-sm text-gray-500">
                    Reviewing records for{' '}
                    <span className="font-semibold text-gray-800">
                      {selectedUser.name}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Activity list */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {userActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Database className="w-12 h-12 mb-3 opacity-20" />

                  <p>
                    No transactions found for this user.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userActivities.map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            activity.type === 'expense'
                              ? 'bg-red-50 text-red-500'
                              : 'bg-emerald-50 text-emerald-500'
                          }`}
                        >
                          {activity.type === 'expense' ? (
                            <TrendingDown className="w-5 h-5" />
                          ) : (
                            <TrendingUp className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-gray-900">
                            {activity.title}
                          </div>

                          <div className="text-xs text-gray-400 mt-0.5 flex gap-2">
                            <span>
                              {new Date(activity.date).toLocaleDateString()}
                            </span>

                            <span className="bullet">
                              •
                            </span>

                            <span>
                              {activity.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`text-lg font-bold ${
                          activity.type === 'expense'
                            ? 'text-red-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {activity.type === 'expense' ? '-' : '+'}$
                        {Number(activity.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="px-8 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}