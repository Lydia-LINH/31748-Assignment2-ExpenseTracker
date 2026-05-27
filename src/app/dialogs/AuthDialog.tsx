import React from 'react';
import { X, AlertCircle, LogIn } from 'lucide-react';

export default function AuthDialog(props: any) {
  const {
    isAuthDialogOpen,
    setIsAuthDialogOpen,
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    showError,
    validatePassword,
    setCurrentUser,
    setIsLoggedIn,
    currentTheme
  } = props;

  // Do not render the modal when it is closed.
  if (!isAuthDialogOpen) {
    return null;
  }

  // Handles both login and registration form submission.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!authForm.email || !authForm.password) {
      showError('Please fill in all required fields');
      return;
    }

    // Extra validation is required only during registration.
    if (authMode === 'register') {
      if (!authForm.name || !authForm.confirmPassword) {
        showError('Please fill in all fields');
        return;
      }

      if (authForm.password !== authForm.confirmPassword) {
        showError('Passwords do not match');
        return;
      }

      if (!validatePassword(authForm.password)) {
        showError('Password is too weak');
        return;
      }
    }

    const url =
      authMode === 'login'
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        let userToSave;

        if (authMode === 'login') {
          // Store the returned JWT together with the user profile.
          userToSave = {
            ...data.user,
            token: data.token
          };
        } else {
          // After registration, ask the user to log in with the new account.
          userToSave = data.user || data;

          if (authMode === 'register') {
            alert('Account created! Please login.');
            setAuthMode('login');
            return;
          }
        }

        setCurrentUser(userToSave);
        setIsLoggedIn(true);

        // Persist authenticated user session for protected API requests.
        localStorage.setItem('expense_user', JSON.stringify(userToSave));

        setAuthForm({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        });

        setIsAuthDialogOpen(false);

        if (authMode === 'login') {
          alert(`Welcome back, ${userToSave.name}!`);

          // Reload after login so hooks can refetch data using the new token.
          window.location.reload();
        }
      } else {
        showError(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Connection Error:', error);
      showError('Server connection failed.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-fadeIn"
      onClick={() => setIsAuthDialogOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[450px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp"
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
            {authMode === 'login' ? 'Login' : 'Register'}
          </h2>

          <button
            onClick={() => setIsAuthDialogOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Name is only required when registering a new account. */}
          {authMode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Name
              </label>

              <input
                type="text"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    name: e.target.value
                  })
                }
                placeholder="Your name"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
                required
              />
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Email
            </label>

            <input
              type="email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({
                  ...authForm,
                  email: e.target.value
                })
              }
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Password
            </label>

            <input
              type="password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({
                  ...authForm,
                  password: e.target.value
                })
              }
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
              required
            />

            {authMode === 'register' && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 mt-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />

                <p className="text-xs text-blue-700 leading-relaxed">
                  Must contain at least 2 types: letters, numbers, or
                  special characters
                </p>
              </div>
            )}
          </div>

          {/* Confirm password is only shown during registration. */}
          {authMode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Confirm Password
              </label>

              <input
                type="password"
                value={authForm.confirmPassword}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    confirmPassword: e.target.value
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
                required
              />
            </div>
          )}

          {/* Submit authentication form */}
          <button
            type="submit"
            className="w-full text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold tracking-tight shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              backgroundColor: currentTheme.buttonColor || '#1F2937'
            }}
          >
            <LogIn className="w-5 h-5" />

            {authMode === 'login' ? 'Login' : 'Create Account'}
          </button>

          {/* Switch between login and registration modes */}
          <div className="text-center">
            <button
              type="button"
              onClick={() =>
                setAuthMode(authMode === 'login' ? 'register' : 'login')
              }
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-all duration-200"
            >
              {authMode === 'login'
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}