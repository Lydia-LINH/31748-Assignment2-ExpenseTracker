import React, { useState, useEffect } from 'react';

// 1. introduce shared types and constants for transactions, themes, and categories.
import { ThemeColors, defaultThemes, availableIcons, recommendedColors } from '../constants/data';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';

// 2. introduce basic layout and pages (strictly check case sensitivity of imports)
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';
import StartPage from './pages/StartPage'; 
import TrackerSidebar from './components/TrackerSidebar';
import TrackerList from './components/TrackerList';
import Categories from './components/Categories';
import NetworkError from './pages/NetworkError';
import AdminDashboard from './pages/AdminDashboard';

// 3. introduce the newly extracted global dialog collection component
import GlobalDialogs from './dialogs/GlobalDialogs';

export default function App() {
  // ================= 1. UI basic state =================
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(defaultThemes[0]);
  const [themes, setThemes] = useState<ThemeColors[]>(defaultThemes);
  const { categories, setCategories } = useCategories();
  
  const [currentView, setCurrentView] = useState<'home' | 'tracker' | 'categories' | 'admin'>('home');
  const [viewHistory, setViewHistory] = useState<('home' | 'tracker' | 'categories' | 'admin')[]>(['home']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ================= 2. Dialog and Form Visibility States =================
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeColors | null>(null);
  const [themeForm, setThemeForm] = useState<ThemeColors>({ name: '', primary: '#409BD8', secondary: '#E6642A', accent1: '#8BC3E5', accent2: '#0201D2', neutral: '#F6F1E4', buttonColor: '#1F2937' });
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [editingBudgetAccount, setEditingBudgetAccount] = useState<string>('');
  const [budgetForm, setBudgetForm] = useState({ amount: '' });
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'DollarSign', color: '#409BD8' });
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [accountForm, setAccountForm] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  // ================= 3. Errors and Login State =================
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string; id?: string; _id?: string } | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '', name: '' });

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2;
  };

  const getCategoryConfig = (category: string) => {
    return categories[category] || categories['Other'];
  };

  // ================= 4. Dynamic Business Data (Hook Fetching) =================
  const {
    formData, setFormData, handleUpdate, deleteTransaction, getAccountExpense,
    totalIncome, totalExpense, balance, chartData, allCategories, 
    filteredTransactions, // Filtered transaction data
    baseFiltered,         // Data specifically for sidebar total calculation
    addAccount, editAccount, deleteAccount,
    transactions, setTransactions, fetchData, 
    accounts, setAccounts, accountBudgets, setAccountBudgets, updateBudgetInDB,
    currentAccount, setCurrentAccount, timeRange, setTimeRange,
    sortConfig, setSortConfig, searchQuery, setSearchQuery, customDateRange, setCustomDateRange,
    monthlyData, 
    selectedCategory, 
    setSelectedCategory
  } = useTransactions(showError);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // ================= 5. Pure Data Submission Methods =================
  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();

    const savedUser = localStorage.getItem('expense_user');
    if (!savedUser) {
      showError("Please login first!");
      return;
    }

    const user = JSON.parse(savedUser);
    const token = user.token;
    const userId = user._id || user.id;

    if (!token) {
      showError("Session expired, please login again.");
      return;
    }

    const transactionData = {
      ...formData,
      userId: userId,
      amount: parseFloat(formData.amount) || 0,
    };

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const newRecord = await response.json();
        const normalizedRecord = { ...newRecord, id: newRecord._id || newRecord.id };

        setTransactions((prev: any) => [normalizedRecord, ...prev]); 
        setIsDialogOpen(false); 
        
        setFormData({
          type: 'expense', title: '', amount: '',
          date: new Date().toISOString().split('T')[0],
          category: '', account: transactionData.account, // 🌟 安全防御：改用局部快照变量
          tag: '', description: ''
        });
      }
    } catch (err) {
      console.error(err);
      showError("Failed to save transaction");
    }
  };

  const openDetail = (transaction: any) => {
    setSelectedTransaction({ ...transaction });
    setIsDetailOpen(true);
  };

  const COLORS = [currentTheme.secondary, currentTheme.primary, currentTheme.accent1, currentTheme.accent2, currentTheme.neutral];

  // initial network status check and real-time listener for network changes to trigger fallback UI
  useEffect(() => {
    const handleOnline = () => setHasNetworkError(false);
    const handleOffline = () => setHasNetworkError(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setHasNetworkError(!navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('expense_user');
    if (data) {
      const user = JSON.parse(data);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  if (hasNetworkError) {
    return <NetworkError currentTheme={currentTheme} setHasNetworkError={setHasNetworkError} />;
  }

  // ================= 6. Dialog States =================
  const dialogStates = {
    isThemeDialogOpen, themes, currentTheme, editingTheme, themeForm, defaultThemes,
    isCategoryDialogOpen, editingCategory, categoryForm, availableIcons, recommendedColors, categories, transactions,
    isDetailOpen, selectedTransaction, accounts, isDialogOpen, formData,
    isAuthDialogOpen, authMode, authForm, currentUser,
    isAccountDialogOpen, editingAccount, accountForm, isAddingAccount, currentAccount, accountBudgets,
    isBudgetDialogOpen, editingBudgetAccount, budgetForm, errorMessage
  };

  const actions = {
    setIsThemeDialogOpen, setThemes, setCurrentTheme, setEditingTheme, setThemeForm, showError,
    setIsCategoryDialogOpen, setCategoryForm, setCategories,
    setIsDetailOpen, setSelectedTransaction, handleUpdate, deleteTransaction,
    setIsDialogOpen, handleSubmit, setFormData,
    setIsAuthDialogOpen, setAuthMode, setAuthForm, validatePassword, setCurrentUser, setIsLoggedIn,
    setIsAccountDialogOpen, setAccounts, setEditingAccount, setAccountForm, setIsAddingAccount, setCurrentAccount, setTransactions, setAccountBudgets, addAccount, editAccount, deleteAccount,
    setIsBudgetDialogOpen, setBudgetForm, getAccountExpense
  };

 return (
    <div 
      className="w-full min-h-screen bg-gray-50 flex flex-col" 
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      {/* 1. Global Navigation Bar */}
      <Header 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        viewHistory={viewHistory} 
        setViewHistory={setViewHistory}
        currentView={currentView} 
        setCurrentView={setCurrentView}
        currentAccount={currentAccount} 
        setIsThemeDialogOpen={setIsThemeDialogOpen}
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser} 
        currentUser={currentUser}
        setIsAuthDialogOpen={setIsAuthDialogOpen} 
        viewMode={viewMode} 
        setViewMode={setViewMode}
      />

      {/* 2. Main Layout Container */}
      <div className="flex flex-1 relative">
        
        {/* Global Sidebar Navigation */}
        <Sidebar
          isSidebarOpen={isSidebarOpen} 
          accounts={accounts} 
          currentAccount={currentAccount}
          setCurrentAccount={setCurrentAccount} 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          viewHistory={viewHistory} 
          setViewHistory={setViewHistory} 
          setIsSidebarOpen={setIsSidebarOpen}
          setAccountForm={setAccountForm} 
          setEditingAccount={setEditingAccount} 
          setIsAddingAccount={setIsAddingAccount}
          setIsAccountDialogOpen={setIsAccountDialogOpen} 
          currentTheme={currentTheme} 
          isLoggedIn={isLoggedIn}
          setIsAuthDialogOpen={setIsAuthDialogOpen}
        />

        {/* Dynamic Main Workspace Router */}
        <main className={`flex-1 transition-all duration-500 ease-out pt-14 ${isSidebarOpen ? 'md:pl-[320px]' : 'pl-0'}`}>
          {viewMode === 'admin' && currentUser?.role === 'admin' ? (
            
            // 4.1 Admin Workstation Dashboard 
            <AdminDashboard 
              allTransactions={transactions} 
              currentTheme={currentTheme} 
            />

          ) : (
            
            // 4.2 Standard User Workspace View 
            <>
              {/* A. Portal Homepage View */}
              {currentView === 'home' && (
                !isLoggedIn ? (
                  <div className="max-w-4xl mx-auto p-6 mt-8">
                    <StartPage 
                      isLoggedIn={isLoggedIn} 
                      setIsAuthDialogOpen={setIsAuthDialogOpen} 
                      userName={currentUser?.name} 
                      currentTheme={currentTheme} 
                    />
                  </div>
                ) : (
                  <Homepage 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                    setCurrentView={setCurrentView}
                    viewHistory={viewHistory} 
                    setViewHistory={setViewHistory} 
                    formData={formData} 
                    setFormData={setFormData}
                    currentAccount={currentAccount} 
                    setIsDialogOpen={setIsDialogOpen} 
                    currentTheme={currentTheme}
                    accounts={accounts} 
                    transactions={transactions} 
                    monthlyData={monthlyData} 
                    accountBudgets={accountBudgets}
                    getAccountExpense={getAccountExpense} 
                    setEditingBudgetAccount={setEditingBudgetAccount}
                    setBudgetForm={setBudgetForm} 
                    setIsBudgetDialogOpen={setIsBudgetDialogOpen} 
                    setCurrentAccount={setCurrentAccount}
                  />
                )
              )}

              {/* B. Multidimensional Ledger Tracker View */}
              {currentView === 'tracker' && (
                <div className="flex h-[calc(100vh-3.5rem)] relative overflow-hidden">
                  
                  {/* Left Sidebar: Statistics Context  */}
                  <div className="hidden md:block w-[400px] shrink-0 border-r border-gray-200 overflow-y-auto">
                    <TrackerSidebar 
                      isSidebarOpen={isSidebarOpen} 
                      chartData={chartData} 
                      COLORS={COLORS} 
                      balance={balance}
                      currentTheme={currentTheme} 
                      totalIncome={totalIncome} 
                      totalExpense={totalExpense}
                      allCategories={allCategories} 
                      getCategoryConfig={getCategoryConfig} 
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory} 
                      setCurrentView={setCurrentView} 
                      viewHistory={viewHistory}
                      setViewHistory={setViewHistory} 
                      allTransactions={baseFiltered}        
                      transactions={filteredTransactions}   
                    />
                  </div>

                  {/* Right Panel: Transaction Record List */}
                  <TrackerList 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                    filteredTransactions={filteredTransactions} 
                    formData={formData} 
                    setFormData={setFormData} 
                    currentAccount={currentAccount} 
                    setIsDialogOpen={setIsDialogOpen}
                    currentTheme={currentTheme} 
                    getCategoryConfig={getCategoryConfig} 
                    openDetail={openDetail}
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    timeRange={timeRange} 
                    setTimeRange={setTimeRange}
                    sortConfig={sortConfig} 
                    setSortConfig={setSortConfig} 
                    customDateRange={customDateRange} 
                    setCustomDateRange={setCustomDateRange}
                  />
                </div>
              )}

              {/* C. Budget Categories Management View */}
              {currentView === 'categories' && (
                <Categories 
                  isSidebarOpen={isSidebarOpen} 
                  setIsSidebarOpen={setIsSidebarOpen} 
                  currentTheme={currentTheme}
                  categories={categories} 
                  setCategoryForm={setCategoryForm} 
                  setEditingCategory={setEditingCategory}
                  setIsCategoryDialogOpen={setIsCategoryDialogOpen} 
                  availableIcons={availableIcons}
                  setCurrentView={setCurrentView}
                  viewHistory={viewHistory}
                  setViewHistory={setViewHistory}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. Global Modals Controller Layer */}
      <GlobalDialogs 
        dialogStates={dialogStates} 
        actions={actions} 
      />
    </div>
  );}