import { useState, useCallback, useMemo } from 'react';
import { format, isWithinInterval, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { Transaction } from '../constants/data';

const API_URL = 'http://localhost:5000/api/transactions';
const ACCOUNT_API_URL = 'http://localhost:5000/api/accounts';
const BUDGET_API_URL = 'http://localhost:5000/api/accounts/budget';

export function useTransactions(showError: (msg: string) => void) {
  // ================= 1. basic state =================
  const [currentAccount, setCurrentAccount] = useState('Personal Account');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountBudgets, setAccountBudgets] = useState<{ [key: string]: number }>({});
  
  // ================= 2. filtering, sorting and searching =================
  const [sortConfig, setSortConfig] = useState<'date' | 'amount'>('date');
  // default monthly
  const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month' | 'other'>('month');
  
  //remember custom start and end dates
  const [customDateRange, setCustomDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'), // default first day of the month
    endDate: format(new Date(), 'yyyy-MM-dd') // default today
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    title: '',
    description: '',
    tag: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    account: 'Personal Account',
  });


  // ================= 3. Authentication =================
  const getAuthHeaders = useCallback(() => {
    const savedUser = localStorage.getItem('expense_user');
    if (!savedUser) return null;
    const { token } = JSON.parse(savedUser);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  // ================= 4. Core Data Fetching =================
  const fetchData = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const [txRes, accRes] = await Promise.all([
        fetch(API_URL, { headers }),
        fetch(ACCOUNT_API_URL, { headers })
      ]);

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.map((t: any) => ({ ...t, id: t._id || t.id })));
      }

      if (accRes.ok) {
        const accData = await accRes.json();
        if (accData.length > 0) {
          const accNames = accData.map((a: any) => a.name);
          const budgetsObj: { [key: string]: number } = {};
          accData.forEach((a: any) => { budgetsObj[a.name] = a.budget; });
          setAccounts(accNames);
          setAccountBudgets(budgetsObj);
        }
      }
    } catch (error) {
      console.error("Fetch data error:", error);
      showError("Connection failed");
    }
  }, [getAuthHeaders]);

  // ================= 5. Transaction CRUD Operations =================
  const handleSubmit = async (e: React.FormEvent, onSuccess: () => void) => {
    if (e) e.preventDefault();
    const headers = getAuthHeaders();
    const savedUser = localStorage.getItem('expense_user');
    if (!headers || !savedUser) return;

    const { _id: userId } = JSON.parse(savedUser);
    const payload = { ...formData, userId, amount: parseFloat(formData.amount) || 0 };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setTransactions(prev => [{ ...saved, id: saved._id || saved.id }, ...prev]);
        setFormData(prev => ({ ...prev, amount: '', title: '', description: '', tag: '' }));
        onSuccess();
      }
    } catch (e) { showError("Save failed"); }
  };

  const handleUpdate = useCallback(async (selectedTx: any, onSuccess: () => void) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    const txId = selectedTx._id || selectedTx.id;

    try {
      const res = await fetch(`${API_URL}/${txId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(selectedTx),
      });
      if (res.ok) {
        setTransactions(prev => prev.map(t => (t.id === txId || (t as any)._id === txId) ? { ...selectedTx, id: txId } : t));
        onSuccess();
      }
    } catch (e) { showError("Update failed"); }
  }, [getAuthHeaders, showError]);

  const deleteTransaction = useCallback(async (id: string, onSuccess?: () => void) => { // 🌟 1. 这里加个问号，表示它是可选的
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setTransactions(prev => prev.filter(t => (t as any)._id !== id && t.id !== id));
        
        // if onSuccess callback is provided, call it to allow parent component to do additional actions (like closing modals)
        onSuccess?.(); 
      }
    } catch (e) { 
      console.error(e); 
      showError("Delete failed"); 
    }
  }, [getAuthHeaders, showError]);

  // ================= 6. Account Management Logic =================
  const addAccount = async (name: string, budget: number = 0) => {
    if (accounts.includes(name)) return showError("Account exists");
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      setAccounts(prev => [...prev, name]);
      setAccountBudgets(prev => ({ ...prev, [name]: budget }));
      await fetch(ACCOUNT_API_URL, { method: 'POST', headers, body: JSON.stringify({ name, budget }) });
    } catch (e) { showError("Add account failed"); }
  };

  const deleteAccount = async (name: string) => {
    if (accounts.length <= 1) return showError("Must keep one account");
    const headers = getAuthHeaders();
    if (!headers) return;
    try {
      setAccounts(prev => prev.filter(a => a !== name));
      await fetch(`${ACCOUNT_API_URL}?name=${encodeURIComponent(name)}`, { method: 'DELETE', headers });
    } catch (e) { showError("Delete failed"); }
  };

  const updateBudgetInDB = async (accountName: string, newBudget: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    setAccountBudgets(prev => ({ ...prev, [accountName]: newBudget }));
    try {
      await fetch(BUDGET_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ account: accountName, amount: newBudget })
      });
    } catch (e) { console.error('Budget sync failed'); }
  };

  const editAccount = async (oldName: string, newName: string, newBudget: number) => {
    const headers = getAuthHeaders();
    if (!headers) return;
    const newAccounts = accounts.map(a => a === oldName ? newName : a);
    const newBudgets = { ...accountBudgets };
    delete newBudgets[oldName];
    newBudgets[newName] = newBudget;

    setAccounts(newAccounts);
    setAccountBudgets(newBudgets);
    if (currentAccount === oldName) setCurrentAccount(newName);
    setTransactions(prev => prev.map(t => t.account === oldName ? { ...t, account: newName } : t));

    try {
      await fetch(`${ACCOUNT_API_URL}/rename`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ oldName, newName, budget: newBudget })
      });
    } catch (error) { showError('Rename failed'); }
  };

// ================= 7. Filtering, Sorting and Searching =================
  // baseFiltered only influenced by account and time filters 
  const baseFiltered = useMemo(() => {
    let result = [...transactions];

    // 1. filter by account
    if (currentAccount !== 'All') {
      result = result.filter(t => t.account === currentAccount);
    }

    // 2. filter by time range
    const now = new Date();
    if (timeRange === 'week') {
      result = result.filter(t => isWithinInterval(new Date(t.date), { start: startOfWeek(now), end: endOfWeek(now) }));
    } else if (timeRange === 'month') {
      result = result.filter(t => isSameMonth(new Date(t.date), now));
    } else if (timeRange === 'other') {
      const start = new Date(customDateRange.startDate);
      const end = new Date(customDateRange.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
    }

    return result;
  }, [transactions, currentAccount, timeRange, customDateRange]);

  // viewFiltered is the final filtered list that the UI will consume, influenced by all filters, search and sorting
  const filteredTransactions = useMemo(() => {
    let result = [...baseFiltered];

    // 1. filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    // 2. filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        (t.title && t.title.toLowerCase().includes(query)) || 
        (t.category && t.category.toLowerCase().includes(query)) || 
        (t.tag && t.tag.toLowerCase().includes(query)) || 
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // 3. sorting logic
    result.sort((a, b) => {
      if (sortConfig === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    });

    return result;
  }, [baseFiltered, selectedCategory, searchQuery, sortConfig]);

  // ================= 8. Derived Statistics =================
  const currentAccountTransactions = transactions.filter(t => t.account === currentAccount);
  
  // core financial summaries for the current filtered view
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
  
  const chartData = useMemo(() => {
    const data = currentAccountTransactions.filter(t => t.type === 'expense').reduce((acc, t) => { 
        acc[t.category] = (acc[t.category] || 0) + (Number(t.amount) || 0); 
        return acc; 
      }, {} as any);
    return Object.entries(data).map(([name, value]) => ({ name, value: Number(value) })).filter(i => i.value > 0);
  }, [currentAccountTransactions]);

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = useMemo(() => {
    const data = transactions.reduce((acc, t) => {
      const month = t.date ? format(new Date(t.date), 'MMM') : 'Unknown'; 
      if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
      acc[month][t.type] += Number(t.amount) || 0;
      return acc;
    }, {} as Record<string, any>);
    return Object.values(data).sort((a: any, b: any) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  }, [transactions]);

  // ================= 9. Return Object =================
  return {
    transactions, setTransactions, accounts, setAccounts, accountBudgets, setAccountBudgets,
    currentAccount, setCurrentAccount, timeRange, setTimeRange,
    customDateRange, setCustomDateRange, selectedCategory, setSelectedCategory,
    formData, setFormData, searchQuery, setSearchQuery, sortConfig, setSortConfig, 
    filteredTransactions, 
    baseFiltered, // output the intermediate filtered list for debugging or advanced use
    totalIncome, totalExpense, balance: totalIncome - totalExpense, chartData, monthlyData,
    allCategories: ['All', ...Array.from(new Set(currentAccountTransactions.map(t => t.category)))],
    fetchData, handleSubmit, handleUpdate, deleteTransaction, addAccount, deleteAccount, editAccount, updateBudgetInDB,
    getAccountExpense: (name: string) => 
      transactions.filter(t => t.account === name && t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0)
  };}