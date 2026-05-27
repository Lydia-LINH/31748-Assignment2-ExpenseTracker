import { X, Wallet } from 'lucide-react';

export default function BudgetDialog(props: any) {
  const {
    isBudgetDialogOpen,
    setIsBudgetDialogOpen,
    editingBudgetAccount,
    budgetForm,
    setBudgetForm,
    getAccountExpense,
    accountBudgets,
    setAccountBudgets,
    currentTheme,
    showError
  } = props;

  // Do not render the modal when it is closed.
  if (!isBudgetDialogOpen) {
    return null;
  }

  // Save the updated budget to the backend API.
  const handleSaveBudget = async () => {
    const amount = parseFloat(budgetForm.amount);

    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid budget amount');
      return;
    }

    try {
      // Retrieve the authenticated user token from local storage.
      const savedUser = localStorage.getItem('expense_user');

      const user = savedUser
        ? JSON.parse(savedUser)
        : null;

      const token = user?.token;

      if (!token) {
        showError('Session expired, please login again');
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/accounts/budget',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',

            // Protected route using JWT authentication.
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            account: editingBudgetAccount,
            amount: amount
          })
        }
      );

      if (response.ok) {
        // Update frontend budget state after successful save.
        setAccountBudgets({
          ...accountBudgets,
          [editingBudgetAccount]: amount
        });

        setIsBudgetDialogOpen(false);
      } else {
        const errorText = await response.text();

        console.error('Server Error:', errorText);

        showError(`Save failed: ${response.status}`);
      }
    } catch (err) {
      console.error('Network Error:', err);

      showError('Network error, check your server');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => setIsBudgetDialogOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-[450px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp"
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
            Set Budget
          </h2>

          <button
            onClick={() => setIsBudgetDialogOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* Budget account information */}
          <div className="mb-4">

            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-gray-600" />

              <span
                className="font-semibold text-gray-900"
                style={{
                  fontFamily: '"Space Grotesk", sans-serif'
                }}
              >
                {editingBudgetAccount}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Set the total expense budget for this account
            </p>
          </div>

          {/* Budget amount input */}
          <div className="space-y-1.5">

            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Monthly Budget
            </label>

            <div className="relative">

              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                $
              </div>

              <input
                type="number"
                step="0.01"
                value={budgetForm.amount}
                onChange={(e) =>
                  setBudgetForm({
                    amount: e.target.value
                  })
                }
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-lg font-semibold"
                autoFocus
              />
            </div>

            {/* Current account expense summary */}
            <p className="text-xs text-gray-500 mt-2">
              Current spending: $
              {getAccountExpense(editingBudgetAccount).toFixed(2)}
            </p>
          </div>

          {/* Dialog actions */}
          <div className="mt-6 flex gap-3">

            <button
              onClick={handleSaveBudget}
              className="flex-1 text-white py-3 rounded-xl transition-opacity font-medium"
              style={{
                backgroundColor:
                  currentTheme.buttonColor || '#1F2937'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Save Budget
            </button>

            <button
              onClick={() => setIsBudgetDialogOpen(false)}
              className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}