import { Wallet, Settings, LogIn } from 'lucide-react';

export default function Sidebar(props: any) {
  const {
    isSidebarOpen,
    accounts,
    currentAccount,
    setCurrentAccount,
    currentView,
    setCurrentView,
    viewHistory,
    setViewHistory,
    setIsSidebarOpen,
    setAccountForm,
    setEditingAccount,
    setIsAddingAccount,
    setIsAccountDialogOpen,
    currentTheme,
    isLoggedIn,
    setIsAuthDialogOpen
  } = props;

  return (
    <div
      className="fixed left-0 top-14 bottom-0 bg-white border-r border-gray-200 shadow-sm z-30 transition-all duration-500 ease-out flex flex-col"
      style={{
        width: '320px',
        transform: isSidebarOpen
          ? 'translateX(0)'
          : 'translateX(-100%)'
      }}
    >
      {/* Sidebar header */}
      <div className="p-6 border-b border-gray-200 shrink-0">

        <h2
          className="font-semibold text-gray-900 tracking-tight mb-2"
          style={{
            fontFamily: '"Space Grotesk", sans-serif'
          }}
        >
          Accounts
        </h2>

        <p className="text-sm text-gray-500">
          Switch between your accounts
        </p>
      </div>

      {/* Display login prompt if the user is not authenticated */}
      {!isLoggedIn ? (

        <div className="p-6 flex-1">

          <div
            onClick={() => {
              // Open authentication dialog
              setIsAuthDialogOpen(true);

              // Close sidebar after opening dialog
              setIsSidebarOpen(false);
            }}
            className="p-6 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 hover:shadow-lg transition-all group mt-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">

              <LogIn className="w-6 h-6 text-blue-600" />
            </div>

            <span
              className="text-base font-bold text-gray-700 group-hover:text-blue-600 transition-colors"
              style={{
                fontFamily: '"Space Grotesk", sans-serif'
              }}
            >
              Log in to sync
            </span>

            <span className="text-sm text-gray-400 mt-1 text-center">
              Access your accounts securely
            </span>
          </div>
        </div>

      ) : (

        <>
          {/* Account selection list */}
          <div className="p-4 space-y-2 flex-1 overflow-y-auto">

            {accounts.map((account: string) => (

              <button
                key={account}
                onClick={() => {
                  setCurrentAccount(account);

                  // Automatically open tracker view
                  // when selecting an account from homepage
                  if (currentView === 'home') {
                    setCurrentView('tracker');

                    setViewHistory([
                      ...viewHistory,
                      'tracker'
                    ]);

                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentAccount === account
                    ? 'text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                style={
                  currentAccount === account
                    ? {
                        backgroundColor:
                          currentTheme.buttonColor || '#1F2937'
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-3">

                  <Wallet className="w-4 h-4" />

                  <span
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif'
                    }}
                  >
                    {account}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Account management action */}
          <div className="p-4 shrink-0 border-t border-gray-100">

            <button
              onClick={() => {
                // Reset account dialog state
                setAccountForm('');
                setEditingAccount(null);
                setIsAddingAccount(false);

                // Open account management dialog
                setIsAccountDialogOpen(true);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                fontFamily: '"Space Grotesk", sans-serif'
              }}
            >
              <Settings className="w-4 h-4" />

              <span className="text-sm font-bold">
                Manage Accounts
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}