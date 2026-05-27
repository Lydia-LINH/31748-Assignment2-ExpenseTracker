import {
  Plus,
  Calendar,
  Wallet,
  TrendingUp,
  TrendingDown,
  Settings,
  ChevronRight
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts';

export default function Home(props: any) {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    setCurrentView,
    viewHistory,
    setViewHistory,
    formData,
    setFormData,
    setIsDialogOpen,
    currentTheme,
    accounts,
    transactions,
    monthlyData,
    accountBudgets,
    getAccountExpense,
    setEditingBudgetAccount,
    setBudgetForm,
    setIsBudgetDialogOpen,
    currentAccount,
    setCurrentAccount
  } = props;

  return (
    <div
      className="flex-1 overflow-y-auto p-8 transition-all duration-500 ease-out"
      style={{
        transform: isSidebarOpen ? 'translateX(0px)' : 'translateX(0)'
      }}
      onClick={() => {
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setCurrentView('tracker');
              setViewHistory([...viewHistory, 'tracker']);

              // Preselect the current account when adding a transaction.
              setFormData({
                ...formData,
                account: currentAccount
              });

              setIsDialogOpen(true);
            }}
            className="text-white p-5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              backgroundColor: currentTheme.buttonColor || '#1F2937'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Plus className="w-6 h-6" />

            <span
              className="font-medium tracking-tight"
              style={{
                fontSize: '1.2rem'
              }}
            >
              Add Transaction
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentView('tracker');
              setViewHistory([...viewHistory, 'tracker']);
            }}
            className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 p-5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm"
            style={{
              fontFamily: '"Space Grotesk", sans-serif'
            }}
          >
            <Calendar className="w-6 h-6" />

            <span
              className="font-medium tracking-tight"
              style={{
                fontSize: '1.2rem'
              }}
            >
              View All Transactions
            </span>
          </button>
        </div>

        {/* Account overview cards */}
        <div className="-mt-3">
          <h2
            className="mb-4 font-semibold text-gray-900 tracking-tight"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.25rem'
            }}
          >
            Account Overview
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {accounts.map((account: any) => {
              const accountTransactions = transactions.filter(
                (t: any) => t.account === account
              );

              const accountIncome = accountTransactions
                .filter((t: any) => t.type === 'income')
                .reduce(
                  (sum: number, t: any) => sum + t.amount,
                  0
                );

              const accountExpense = accountTransactions
                .filter((t: any) => t.type === 'expense')
                .reduce(
                  (sum: number, t: any) => sum + t.amount,
                  0
                );

              const accountBalance = accountIncome - accountExpense;

              return (
                <div
                  key={account}
                  onClick={() => {
                    // Open tracker view for the selected account.
                    setCurrentAccount(account);
                    setCurrentView('tracker');
                    setViewHistory([...viewHistory, 'tracker']);
                  }}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:border-gray-400 hover:shadow-md transition-all duration-300 group relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                        <Wallet className="w-5 h-5 text-gray-600" />
                      </div>

                      <h3
                        className="font-medium text-gray-900"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif'
                        }}
                      >
                        {account}
                      </h3>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transform group-hover:translate-x-1 transition-all" />
                  </div>

                  <div
                    className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif'
                    }}
                  >
                    {accountBalance < 0
                      ? `-$${Math.abs(accountBalance).toFixed(2)}`
                      : `$${accountBalance.toFixed(2)}`}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div
                      className="flex items-center gap-1"
                      style={{
                        color: currentTheme.primary
                      }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>${accountIncome.toFixed(0)}</span>
                    </div>

                    <div
                      className="flex items-center gap-1"
                      style={{
                        color: currentTheme.secondary
                      }}
                    >
                      <TrendingDown className="w-4 h-4" />
                      <span>${accountExpense.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income and expense trend chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2
            className="mb-4 font-semibold text-gray-900 tracking-tight"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: '1.25rem'
            }}
          >
            Income & Expense Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={monthlyData}>
              <CartesianGrid
                key="grid"
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              <XAxis
                key="xaxis"
                dataKey="month"
                stroke="#6b7280"
              />

              <YAxis
                key="yaxis"
                stroke="#6b7280"
              />

              <Tooltip key="tooltip" />
              <Legend key="legend" />

              <Line
                key="income-line"
                type="monotone"
                dataKey="income"
                stroke={currentTheme.primary}
                strokeWidth={2}
                name="Income"
              />

              <Line
                key="expense-line"
                type="monotone"
                dataKey="expense"
                stroke={currentTheme.secondary}
                strokeWidth={2}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Budget overview */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-xl font-bold text-gray-900 tracking-tight"
              style={{
                fontFamily: '"Space Grotesk", sans-serif'
              }}
            >
              Budget Overview
            </h2>
          </div>

          <div className="space-y-4">
            {accounts.map((account: any) => {
              const spent = getAccountExpense(account);
              const budget = accountBudgets[account] || 0;
              const percentage = budget > 0 ? (spent / budget) * 100 : 0;
              const isOverBudget = spent > budget;

              return (
                <div
                  key={account}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-600" />

                      <span
                        className="font-semibold text-gray-900"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif'
                        }}
                      >
                        {account}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        // Open budget editing dialog for this account.
                        setEditingBudgetAccount(account);
                        setBudgetForm({
                          amount: accountBudgets[account]?.toString() || ''
                        });
                        setIsBudgetDialogOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all duration-200"
                      title="Set Budget"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span
                        className="text-2xl font-bold tracking-tight"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          color: isOverBudget ? '#EF4444' : '#111827'
                        }}
                      >
                        ${spent.toFixed(2)}
                      </span>

                      <span className="text-sm text-gray-500">
                        / ${budget.toFixed(2)}
                      </span>
                    </div>

                    {/* Budget usage progress bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isOverBudget
                            ? '#EF4444'
                            : currentTheme.primary
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={
                          isOverBudget
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-600'
                        }
                      >
                        {percentage.toFixed(0)}% used
                      </span>

                      {isOverBudget && (
                        <span className="text-red-600 font-semibold">
                          Over by ${(spent - budget).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}