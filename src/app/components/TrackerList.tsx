import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Search,
  Download,
  Plus,
  Calendar,
  ArrowUpDown,
  HelpCircle
} from 'lucide-react';

export default function TrackerList(props: any) {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    filteredTransactions,
    formData,
    setFormData,
    currentAccount,
    setIsDialogOpen,
    currentTheme,
    getCategoryConfig,
    openDetail,
    searchQuery,
    setSearchQuery,
    timeRange,
    setTimeRange,
    customDateRange,
    setCustomDateRange,
    sortConfig,
    setSortConfig
  } = props;

  // Controls the custom time-range dropdown menu.
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);

  const timeLabels: Record<string, string> = {
    all: 'All Time',
    week: 'This Week',
    month: 'This Month',
    other: 'Custom Range'
  };

  // Export the currently filtered transaction list as a CSV file.
  const exportToCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = [
      'Date',
      'Type',
      'Category',
      'Title',
      'Amount',
      'Account',
      'Tag'
    ];

    const csvData = filteredTransactions.map((t: any) => [
      t.date ? format(new Date(t.date), 'yyyy-MM-dd') : 'No Date',
      t.type,
      t.category || 'Uncategorized',
      `"${t.title || 'Untitled'}"`,
      t.amount || 0,
      t.account,
      t.tag || ''
    ].join(','));

    const csvString = [
      headers.join(','),
      ...csvData
    ].join('\n');

    const blob = new Blob([csvString], {
      type: 'text/csv'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${currentAccount}_Transactions_${format(
      new Date(),
      'yyyy-MM-dd'
    )}.csv`;

    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex-1 flex flex-col transition-all duration-500 ease-out"
      style={{ marginLeft: isSidebarOpen ? '0' : '0' }}
      onClick={() => {
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }}
    >
      {/* Header controls */}
      <div className="p-6 border-b border-gray-200 bg-white">

        {/* Title and primary actions */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="font-semibold text-gray-900 tracking-tight"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '1.25rem'
              }}
            >
              Transactions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredTransactions.length} records found
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setSortConfig(sortConfig === 'date' ? 'amount' : 'date')
              }
              className="flex items-center justify-center p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm group"
              title={
                sortConfig === 'date'
                  ? 'Sort by Amount'
                  : 'Sort by Date'
              }
            >
              <ArrowUpDown
                className={`w-5 h-5 transition-colors ${
                  sortConfig === 'amount' ? 'text-blue-500' : ''
                }`}
                style={{
                  color:
                    sortConfig === 'amount'
                      ? currentTheme.primary
                      : ''
                }}
              />
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center justify-center p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              title="Export to CSV"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                // Pre-select the current account when opening the add form.
                setFormData({
                  ...formData,
                  account: currentAccount
                });

                setIsDialogOpen(true);
              }}
              className="text-white p-3 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                backgroundColor: currentTheme.buttonColor || '#1F2937'
              }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and date filters */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

            <input
              type="text"
              placeholder="Search title, category, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
              style={
                {
                  '--tw-ring-color': currentTheme.primary
                } as React.CSSProperties
              }
            />
          </div>

          {/* Time-range dropdown and custom date inputs */}
          <div className="relative min-w-[140px] flex flex-wrap sm:flex-nowrap items-center gap-2 z-10">
            <div className="relative w-full sm:w-auto min-w-[140px]">
              <button
                onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  isTimeMenuOpen
                    ? 'border-blue-400 ring-2 ring-blue-100 bg-white'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />

                  {timeLabels[timeRange as keyof typeof timeLabels] ||
                    'This Month'}
                </div>

                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isTimeMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isTimeMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden">
                  {Object.entries(timeLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setTimeRange(value as any);
                        setIsTimeMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        timeRange === value
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Custom date range appears only when Custom Range is selected. */}
            {timeRange === 'other' && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <input
                  type="date"
                  value={customDateRange?.startDate || ''}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      startDate: e.target.value
                    })
                  }
                  className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={
                    {
                      '--tw-ring-color': currentTheme.primary
                    } as React.CSSProperties
                  }
                />

                <span className="text-gray-400 font-medium">
                  to
                </span>

                <input
                  type="date"
                  value={customDateRange?.endDate || ''}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      endDate: e.target.value
                    })
                  }
                  className="py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={
                    {
                      '--tw-ring-color': currentTheme.primary
                    } as React.CSSProperties
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="flex-1 overflow-y-auto p-6 z-0">
        <div className="space-y-3">
          {filteredTransactions.map((transaction: any, index: number) => {
            const config =
              getCategoryConfig(transaction.category) || {
                icon: HelpCircle,
                color: '#9CA3AF'
              };

            const CategoryIcon = config.icon;
            const safeAmount = Number(transaction.amount) || 0;

            // Format the date safely to avoid breaking the list on invalid values.
            let safeDate = 'Invalid Date';

            try {
              safeDate = transaction.date
                ? format(new Date(transaction.date), 'MMM dd, yyyy')
                : 'No Date';
            } catch (e) {
              safeDate = 'Invalid Date';
            }

            return (
              <div
                key={transaction._id || transaction.id || index}
                onClick={() => openDetail(transaction)}
                className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative group"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
                  style={{
                    backgroundColor: config.color
                  }}
                />

                <div className="flex items-start gap-3 p-4 pl-5">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                    <CategoryIcon
                      className="w-5 h-5 text-gray-500 flex-shrink-0"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="font-bold text-gray-900 tracking-tight"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif'
                        }}
                      >
                        {transaction.title || 'Untitled'}
                      </span>

                      {transaction.tag && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 font-medium text-[10px] uppercase tracking-wider rounded border border-gray-200">
                          {transaction.tag}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">
                        {transaction.category || 'Uncategorized'}
                      </span>

                      <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">
                        {safeDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center ml-4 flex-shrink-0 pt-1">
                    <div
                      className="font-bold tracking-tight text-lg"
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        color:
                          transaction.type === 'income'
                            ? currentTheme.primary
                            : currentTheme.secondary
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}$
                      {safeAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>

              <p className="font-medium text-gray-500">
                No matching transactions found
              </p>

              <p className="text-sm mt-1">
                Try adjusting your filters or search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}