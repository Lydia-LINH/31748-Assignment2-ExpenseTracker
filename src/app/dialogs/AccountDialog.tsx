import { X, Wallet, Edit3, Trash2, Save, Plus } from 'lucide-react';

export default function AccountDialog(props: any) {
  const {
    isAccountDialogOpen,
    setIsAccountDialogOpen,
    accounts,
    editingAccount,
    setEditingAccount,
    accountForm,
    setAccountForm,
    isAddingAccount,
    setIsAddingAccount,
    transactions,
    accountBudgets,
    currentTheme,
    showError,
    addAccount,
    editAccount,
    deleteAccount
  } = props;

  // Do not render the modal when it is closed.
  if (!isAccountDialogOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => setIsAccountDialogOpen(false)}
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
            Manage Accounts
          </h2>

          <button
            onClick={() => setIsAccountDialogOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Existing account list */}
          <div className="space-y-2">
            {accounts.map((account: string) => (
              <div
                key={account}
                className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between"
              >
                {editingAccount === account ? (
                  <>
                    {/* Inline account rename form */}
                    <input
                      type="text"
                      value={accountForm}
                      onChange={(e) => setAccountForm(e.target.value)}
                      placeholder="Account name"
                      className="flex-1 px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 mr-2 placeholder:text-gray-400"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          if (!accountForm) {
                            showError('Please enter an account name');
                            return;
                          }

                          if (
                            accounts.includes(accountForm) &&
                            accountForm !== editingAccount
                          ) {
                            showError('Account name already exists');
                            return;
                          }

                          // Keep the existing budget when renaming the account.
                          const currentBudget =
                            accountBudgets[editingAccount] || 0;

                          await editAccount(
                            editingAccount,
                            accountForm,
                            currentBudget
                          );

                          setEditingAccount(null);
                          setAccountForm('');
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      >
                        <Save className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingAccount(null);
                          setAccountForm('');
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Read-only account row */}
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-gray-600" />

                      <span
                        className="font-medium text-gray-900"
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif'
                        }}
                      >
                        {account}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAccount(account);
                          setAccountForm(account);
                          setIsAddingAccount(false);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={async () => {
                          if (accounts.length === 1) {
                            showError('Cannot delete the last account');
                            return;
                          }

                          const hasTransactions = transactions.some(
                            (t: any) => t.account === account
                          );

                          if (hasTransactions) {
                            showError(
                              'Cannot delete account: transactions exist'
                            );
                            return;
                          }

                          await deleteAccount(account);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Account creation form */}
          {isAddingAccount ? (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Add New Account
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={accountForm}
                  onChange={(e) => setAccountForm(e.target.value)}
                  placeholder="Account name"
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                  autoFocus
                />

                <button
                  onClick={async () => {
                    if (!accountForm) {
                      showError('Please enter an account name');
                      return;
                    }

                    if (accounts.includes(accountForm)) {
                      showError('Account name already exists');
                      return;
                    }

                    // New accounts start with a default budget of 0.
                    await addAccount(accountForm, 0);

                    setAccountForm('');
                    setIsAddingAccount(false);
                  }}
                  className="text-white px-4 py-2 rounded-lg transition-opacity"
                  style={{
                    backgroundColor: currentTheme.buttonColor || '#1F2937'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  <Save className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsAddingAccount(false);
                    setAccountForm('');
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsAddingAccount(true);
                setAccountForm('');
                setEditingAccount(null);
              }}
              className="w-full text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-opacity"
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
              <Plus className="w-5 h-5" />
              Add Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}