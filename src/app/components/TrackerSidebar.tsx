import React, { useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Settings
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function TrackerSidebar(props: any) {
  const {
    isSidebarOpen,
    COLORS,
    balance,
    currentTheme,
    totalIncome,
    totalExpense,
    allCategories,
    getCategoryConfig,
    selectedCategory,
    setSelectedCategory,
    transactions,
    allTransactions,
    setCurrentView,
    viewHistory,
    setViewHistory
  } = props;

  // Build chart data from the currently filtered expense transactions.
  const dynamicChartData = useMemo(() => {
    const totals: Record<string, number> = {};

    const expenseItems = (transactions || []).filter(
      (t: any) => t.type === 'expense'
    );

    expenseItems.forEach((t: any) => {
      const category = t.category || 'Uncategorized';
      const amount = Number(t.amount) || 0;

      totals[category] = (totals[category] || 0) + amount;
    });

    return Object.entries(totals).map(([name, value]) => {
      const config = getCategoryConfig?.(name) || {
        color: '#9CA3AF'
      };

      return {
        name,
        value,
        color: config.color
      };
    });
  }, [transactions, getCategoryConfig]);

  return (
    <div
      className="w-[400px] min-w-[400px] shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-out"
      style={{
        marginLeft: isSidebarOpen ? '0px' : '0'
      }}
    >
      {/* Expense distribution chart */}
      <div className="min-h-[220px] p-6 border-b border-gray-200 flex flex-col">
        <h2
          className="mb-4 font-semibold text-gray-900 tracking-tight"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '1.125rem'
          }}
        >
          Expense Distribution
        </h2>

        {dynamicChartData.length > 0 ? (
          <div className="w-full h-[150px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {dynamicChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number) =>
                    `$${Number(value).toFixed(2)}`
                  }
                  labelStyle={{
                    display: 'none'
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow:
                      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    fontFamily: '"Space Grotesk", sans-serif'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p className="text-sm">
              No expense data
            </p>
          </div>
        )}
      </div>

      {/* Financial summary and category filters */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2
          className="mb-4 font-semibold text-gray-900 tracking-tight"
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '1.125rem'
          }}
        >
          Category Filter
        </h2>

        {/* Account-level financial summary */}
        <div className="space-y-3 mb-6">
          <div className="bg-gradient-to-br from-[#F6F1E4] to-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Wallet className="w-5 h-5" />

              <span className="text-sm font-medium">
                Balance
              </span>
            </div>

            <div
              className="text-xl font-semibold text-gray-900 tracking-tight"
              style={{
                fontFamily: '"Space Grotesk", sans-serif'
              }}
            >
              ${balance.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className="bg-gradient-to-br rounded-lg p-4 border"
              style={{
                backgroundColor: `${currentTheme.primary}15`,
                borderColor: `${currentTheme.primary}40`
              }}
            >
              <div
                className="flex items-center gap-2 mb-1"
                style={{
                  color: currentTheme.primary
                }}
              >
                <TrendingUp className="w-5 h-5" />

                <span className="text-sm font-medium">
                  Income
                </span>
              </div>

              <div
                className="font-semibold tracking-tight"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: currentTheme.primary
                }}
              >
                ${totalIncome.toFixed(2)}
              </div>
            </div>

            <div
              className="bg-gradient-to-br rounded-lg p-4 border"
              style={{
                backgroundColor: `${currentTheme.secondary}15`,
                borderColor: `${currentTheme.secondary}40`
              }}
            >
              <div
                className="flex items-center gap-2 mb-1"
                style={{
                  color: currentTheme.secondary
                }}
              >
                <TrendingDown className="w-5 h-5" />

                <span className="text-sm font-medium">
                  Expense
                </span>
              </div>

              <div
                className="font-semibold tracking-tight"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: currentTheme.secondary
                }}
              >
                ${totalExpense.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Category filter list */}
        <div className="space-y-2">
          {allCategories.map((category: string) => {
            const config =
              category !== 'All' ? getCategoryConfig(category) : null;

            const CategoryIcon = config?.icon;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left rounded-lg border transition-all duration-200 overflow-hidden relative ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
                style={
                  selectedCategory === category
                    ? {
                        backgroundColor:
                          currentTheme.buttonColor || currentTheme.primary,
                        borderColor:
                          currentTheme.buttonColor || currentTheme.primary
                      }
                    : {}
                }
              >
                {config && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{
                      backgroundColor:
                        selectedCategory === category
                          ? 'white'
                          : config.color
                    }}
                  />
                )}

                <div className="flex items-center gap-3 px-4 py-2 pl-5">
                  {config && CategoryIcon && (
                    <CategoryIcon
                      className={`w-5 h-5 flex-shrink-0 ${
                        selectedCategory === category
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    />
                  )}

                  <span className="flex-1">
                    {category}
                  </span>

                  <span className="text-sm opacity-75">
                    {category === 'All'
                      ? (allTransactions || []).length
                      : (allTransactions || []).filter(
                          (t: any) => t.category === category
                        ).length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigate to category management page */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setCurrentView('categories');
              setViewHistory([
                ...viewHistory,
                'categories'
              ]);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              fontFamily: '"Space Grotesk", sans-serif'
            }}
          >
            <Settings className="w-4 h-4" />

            <span className="text-sm font-medium">
              Manage Categories
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}