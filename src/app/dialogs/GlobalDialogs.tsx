import React from 'react';

import ThemeDialog from './ThemeDialog';
import CategoryDialog from './CategoryDialog';
import TransactionDetailDialog from './TransactionDetailDialog';
import AddTransactionDialog from './AddTransactionDialog';
import AuthDialog from './AuthDialog';
import AccountDialog from './AccountDialog';
import BudgetDialog from './BudgetDialog';
import ErrorMessage from '../components/ErrorMessage';

interface GlobalDialogsProps {
  // Centralised state object for all modal components.
  dialogStates: any;

  // Centralised action object for updating modal state and business data.
  actions: any;
}

export default function GlobalDialogs({
  dialogStates,
  actions
}: GlobalDialogsProps) {
  const {
    isThemeDialogOpen,
    themes,
    currentTheme,
    editingTheme,
    themeForm,
    defaultThemes,

    isCategoryDialogOpen,
    editingCategory,
    categoryForm,
    availableIcons,
    recommendedColors,
    categories,
    transactions,

    isDetailOpen,
    selectedTransaction,
    accounts,

    isDialogOpen,
    formData,

    isAuthDialogOpen,
    authMode,
    authForm,
    currentUser,

    isAccountDialogOpen,
    editingAccount,
    accountForm,
    isAddingAccount,
    currentAccount,
    accountBudgets,

    isBudgetDialogOpen,
    editingBudgetAccount,
    budgetForm,
    errorMessage
  } = dialogStates;

  const {
    setIsThemeDialogOpen,
    setThemes,
    setCurrentTheme,
    setEditingTheme,
    setThemeForm,
    showError,

    setIsCategoryDialogOpen,
    setCategoryForm,
    setCategories,

    setIsDetailOpen,
    setSelectedTransaction,
    handleUpdate,
    deleteTransaction,

    setIsDialogOpen,
    handleSubmit,
    setFormData,

    setIsAuthDialogOpen,
    setAuthMode,
    setAuthForm,
    validatePassword,
    setCurrentUser,
    setIsLoggedIn,

    setIsAccountDialogOpen,
    setAccounts,
    setEditingAccount,
    setAccountForm,
    setIsAddingAccount,
    setCurrentAccount,
    setTransactions,
    setAccountBudgets,
    addAccount,
    editAccount,
    deleteAccount,

    setIsBudgetDialogOpen,
    setBudgetForm,
    getAccountExpense
  } = actions;

  return (
    <>
      {/* Theme customisation modal */}
      <ThemeDialog
        isThemeDialogOpen={isThemeDialogOpen}
        setIsThemeDialogOpen={setIsThemeDialogOpen}
        themes={themes}
        setThemes={setThemes}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        editingTheme={editingTheme}
        setEditingTheme={setEditingTheme}
        themeForm={themeForm}
        setThemeForm={setThemeForm}
        defaultThemes={defaultThemes}
        showError={showError}
      />

      {/* Category creation and editing modal */}
      <CategoryDialog
        isCategoryDialogOpen={isCategoryDialogOpen}
        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
        editingCategory={editingCategory}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        availableIcons={availableIcons}
        recommendedColors={recommendedColors}
        currentTheme={currentTheme}
        categories={categories}
        setCategories={setCategories}
        transactions={transactions}
        showError={showError}
      />

      {/* Transaction detail and update modal */}
      <TransactionDetailDialog
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        handleUpdate={handleUpdate}
        currentTheme={currentTheme}
        categories={categories}
        accounts={accounts}
        deleteTransaction={deleteTransaction}
      />

      {/* Transaction creation modal */}
      <AddTransactionDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        currentTheme={currentTheme}
        categories={categories}
        accounts={accounts}
      />

      {/* Login and registration modal */}
      <AuthDialog
        isAuthDialogOpen={isAuthDialogOpen}
        setIsAuthDialogOpen={setIsAuthDialogOpen}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        showError={showError}
        validatePassword={validatePassword}
        setCurrentUser={setCurrentUser}
        setIsLoggedIn={setIsLoggedIn}
        currentTheme={currentTheme}
      />

      {/* Account management modal */}
      <AccountDialog
        isAccountDialogOpen={isAccountDialogOpen}
        setIsAccountDialogOpen={setIsAccountDialogOpen}
        accounts={accounts}
        setAccounts={setAccounts}
        editingAccount={editingAccount}
        setEditingAccount={setEditingAccount}
        accountForm={accountForm}
        setAccountForm={setAccountForm}
        isAddingAccount={isAddingAccount}
        setIsAddingAccount={setIsAddingAccount}
        currentAccount={currentAccount}
        setCurrentAccount={setCurrentAccount}
        transactions={transactions}
        setTransactions={setTransactions}
        accountBudgets={accountBudgets}
        setAccountBudgets={setAccountBudgets}
        currentTheme={currentTheme}
        showError={showError}
        addAccount={addAccount}
        editAccount={editAccount}
        deleteAccount={deleteAccount}
      />

      {/* Budget editing modal */}
      <BudgetDialog
        isBudgetDialogOpen={isBudgetDialogOpen}
        setIsBudgetDialogOpen={setIsBudgetDialogOpen}
        editingBudgetAccount={editingBudgetAccount}
        budgetForm={budgetForm}
        setBudgetForm={setBudgetForm}
        getAccountExpense={getAccountExpense}
        accountBudgets={accountBudgets}
        setAccountBudgets={setAccountBudgets}
        currentTheme={currentTheme}
        showError={showError}
        userId={currentUser?.id || currentUser?._id}
      />

      {/* Global error notification */}
      <ErrorMessage errorMessage={errorMessage} />
    </>
  );
}