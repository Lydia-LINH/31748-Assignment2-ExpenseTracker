import {
  Menu,
  ChevronLeft,
  Home,
  Palette,
  User,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export default function Header(props: any) {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    viewHistory,
    setViewHistory,
    currentView,
    setCurrentView,
    currentAccount,
    setIsThemeDialogOpen,
    isLoggedIn,
    setIsLoggedIn,
    setCurrentUser,
    currentUser,
    setIsAuthDialogOpen,
    viewMode,
    setViewMode
  } = props;

  // Navigate back to the previous page using stored navigation history.
  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];

      // Remove the current page from history
      newHistory.pop();

      setViewHistory(newHistory);
      setCurrentView(newHistory[newHistory.length - 1]);

      // Close sidebar after navigation
      setIsSidebarOpen(false);
    }
  };

  // Return to the homepage and reset navigation history.
  const handleHomeNavigation = () => {
    setCurrentView('home');
    setViewHistory(['home']);
    setIsSidebarOpen(false);
  };

  // Toggle between normal user mode and admin dashboard mode.
  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'user' ? 'admin' : 'user');
  };

  // Handle login and logout actions.
  const handleAuthAction = () => {
    if (isLoggedIn) {
      const confirmLogout = window.confirm(
        'Are you sure you want to logout?'
      );

      if (confirmLogout) {
        setIsLoggedIn(false);
        setCurrentUser(null);

        localStorage.removeItem('expense_user');

        // Reset view after logout
        if (typeof setCurrentView === 'function') {
          setCurrentView('home');
        }

        // Always return to normal user mode
        if (typeof setViewMode === 'function') {
          setViewMode('user');
        }
      }
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 z-40">

      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Navigate to previous page */}
      <button
        onClick={handleBack}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Return to homepage */}
      <button
        onClick={handleHomeNavigation}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <Home className="w-5 h-5" />
      </button>

      {/* Dynamic page title */}
      <div
        className="flex-1 text-center font-semibold text-gray-900 tracking-tight truncate"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          letterSpacing: '-0.02em'
        }}
      >
        {viewMode === 'admin'
          ? 'Admin Control Center'
          : (
            currentView === 'home'
              ? ''
              : (
                currentView === 'categories'
                  ? 'Categories'
                  : 'Expense Tracker'
              )
          )}
      </div>

      {/* Admin mode switch */}
      {isLoggedIn && (currentUser as any)?.role === 'admin' && (
        <button
          onClick={handleViewModeToggle}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 px-2 ${
            viewMode === 'admin'
              ? 'bg-red-50 text-red-600 border border-red-100'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={
            viewMode === 'user'
              ? 'Switch to Admin Panel'
              : 'Switch to User View'
          }
        >
          {viewMode === 'admin' ? (
            <>
              <ShieldCheck className="w-5 h-5" />

              <span className="text-[10px] font-black hidden sm:block">
                ADM
              </span>
            </>
          ) : (
            <LayoutDashboard className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Open theme customisation dialog */}
      <button
        onClick={() => setIsThemeDialogOpen(true)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        title="Theme Settings"
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Login / logout button */}
      <button
        onClick={handleAuthAction}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        title={isLoggedIn ? 'Logout' : 'Login'}
      >
        {isLoggedIn ? (
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm overflow-hidden">
            {currentUser?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        ) : (
          <User className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}