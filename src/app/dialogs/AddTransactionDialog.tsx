import { X, Plus } from 'lucide-react';

export default function AddTransactionDialog(props: any) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    formData,
    setFormData,
    currentTheme,
    categories,
    accounts
  } = props;

  // Do not render the modal when it is closed.
  if (!isDialogOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => setIsDialogOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <h2
            className="text-xl font-bold text-gray-900 tracking-tight"
            style={{
              fontFamily: '"Space Grotesk", sans-serif'
            }}
          >
            Add Transaction
          </h2>

          <button
            onClick={() => setIsDialogOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Transaction type selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'expense'
                  })
                }
                className="py-3 px-4 rounded-xl font-semibold transition-all duration-200 border-2"
                style={
                  formData.type === 'expense'
                    ? {
                        backgroundColor: currentTheme.secondary,
                        color: 'white',
                        borderColor: currentTheme.secondary,
                        boxShadow: `0 4px 14px ${currentTheme.secondary}40`
                      }
                    : {
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        borderColor: '#e5e7eb'
                      }
                }
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'income'
                  })
                }
                className="py-3 px-4 rounded-xl font-semibold transition-all duration-200 border-2"
                style={
                  formData.type === 'income'
                    ? {
                        backgroundColor: currentTheme.primary,
                        color: 'white',
                        borderColor: currentTheme.primary,
                        boxShadow: `0 4px 14px ${currentTheme.primary}40`
                      }
                    : {
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        borderColor: '#e5e7eb'
                      }
                }
              >
                Income
              </button>
            </div>
          </div>

          {/* Transaction title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value
                })
              }
              placeholder="e.g., Lunch, Metro Top-up"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Transaction amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Amount
            </label>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                $
              </div>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: e.target.value
                  })
                }
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-lg font-semibold"
                required
              />
            </div>
          </div>

          {/* Transaction date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Date
            </label>

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value
                })
              }
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Category selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Category
            </label>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value
                })
              }
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
              required
            >
              <option value="">
                Select a category
              </option>

              {Object.keys(categories).map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Account selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Account
            </label>

            <select
              value={formData.account}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  account: e.target.value
                })
              }
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
              required
            >
              {accounts.map((account: string) => (
                <option
                  key={account}
                  value={account}
                >
                  {account}
                </option>
              ))}
            </select>
          </div>

          {/* Optional tag field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Tag{' '}
              <span className="text-gray-400 normal-case text-xs">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              value={formData.tag}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tag: e.target.value
                })
              }
              placeholder="e.g., Daily, Fixed"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
            />
          </div>

          {/* Optional description field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Description{' '}
              <span className="text-gray-400 normal-case text-xs">
                (Optional)
              </span>
            </label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
              }
              placeholder="Additional notes"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Submit transaction */}
          <button
            type="submit"
            className="w-full text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold tracking-tight shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              backgroundColor: currentTheme.buttonColor || '#1F2937'
            }}
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}