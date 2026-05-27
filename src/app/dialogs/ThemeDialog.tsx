import { X, Sparkles, Plus, Trash2 } from 'lucide-react';

export default function ThemeDialog(props: any) {
  const {
    isThemeDialogOpen,
    setIsThemeDialogOpen,
    themes,
    setThemes,
    currentTheme,
    setCurrentTheme,
    editingTheme,
    setEditingTheme,
    themeForm,
    setThemeForm,
    defaultThemes,
    showError
  } = props;

  // Do not render the modal when it is closed.
  if (!isThemeDialogOpen) {
    return null;
  }

  // Check whether the selected theme belongs to the default theme set.
  const isDefaultTheme = (theme: any) => {
    return defaultThemes.some(
      (t: any) => t.name === theme.name
    );
  };

  // Save or update a custom theme.
  const handleSaveTheme = () => {
    if (!themeForm.name) {
      showError('Please enter a theme name');
      return;
    }

    const newThemes = editingTheme
      ? themes.map((t: any) =>
          t.name === editingTheme.name
            ? themeForm
            : t
        )
      : [...themes, themeForm];

    setThemes(newThemes);
    setCurrentTheme(themeForm);

    setEditingTheme(null);
    setIsThemeDialogOpen(false);
  };

  // Delete a custom theme.
  const handleDeleteTheme = () => {
    setThemes(
      themes.filter(
        (t: any) => t.name !== editingTheme.name
      )
    );

    // Fallback to the first available theme if the deleted
    // theme is currently active.
    if (currentTheme.name === editingTheme.name) {
      setCurrentTheme(themes[0]);
    }

    setEditingTheme(null);
    setIsThemeDialogOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => setIsThemeDialogOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-[700px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp"
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
            Theme Settings
          </h2>

          <button
            onClick={() => setIsThemeDialogOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Preset and custom theme selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Preset Themes
            </h3>

            <div className="grid grid-cols-3 gap-3">

              {themes.map((theme: any) => (

                <button
                  key={theme.name}
                  onClick={() => {
                    // Apply the selected theme immediately.
                    setCurrentTheme(theme);

                    setIsThemeDialogOpen(false);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    currentTheme.name === theme.name
                      ? 'border-gray-800 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">

                    <Sparkles className="w-3.5 h-3.5 text-gray-600" />

                    <span className="font-semibold text-gray-900 text-xs">
                      {theme.name}
                    </span>
                  </div>

                  {/* Theme colour preview */}
                  <div className="space-y-1.5">

                    <div className="flex gap-1">
                      <div
                        className="w-5 h-5 rounded"
                        style={{
                          backgroundColor: theme.primary
                        }}
                      />

                      <div
                        className="w-5 h-5 rounded"
                        style={{
                          backgroundColor: theme.secondary
                        }}
                      />

                      <div
                        className="w-5 h-5 rounded"
                        style={{
                          backgroundColor: theme.accent1
                        }}
                      />

                      <div
                        className="w-5 h-5 rounded"
                        style={{
                          backgroundColor: theme.accent2
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1">

                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor:
                            theme.buttonColor || '#1F2937'
                        }}
                      />

                      <span className="text-[10px] text-gray-500">
                        Button
                      </span>
                    </div>
                  </div>

                  {/* Only custom themes can be edited */}
                  {!isDefaultTheme(theme) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        setEditingTheme(theme);
                        setThemeForm(theme);
                      }}
                      className="mt-1.5 text-[10px] text-gray-500 hover:text-gray-700"
                    >
                      Edit
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Create a new custom theme */}
          <div>

            <button
              onClick={() => {
                setEditingTheme(null);

                // Initialise the new theme using the current theme colours.
                setThemeForm({
                  name: '',
                  primary: currentTheme.primary,
                  secondary: currentTheme.secondary,
                  accent1: currentTheme.accent1,
                  accent2: currentTheme.accent2,
                  neutral: currentTheme.neutral,
                  buttonColor: currentTheme.buttonColor
                });
              }}
              className="w-full text-white px-4 py-2 rounded-lg transition-opacity flex items-center justify-center gap-2"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
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
              <Plus className="w-5 h-5" />

              Create Custom Theme
            </button>
          </div>

          {/* Theme editing form */}
          {(editingTheme || themeForm.name === '') &&
          editingTheme !== null ? null : (

            <div className="border-t pt-6">

              <h3 className="font-medium text-gray-900 mb-4">
                {editingTheme
                  ? 'Edit Theme'
                  : 'New Theme'}
              </h3>

              <div className="space-y-4">

                {/* Theme name */}
                <div className="space-y-1.5">

                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Theme Name
                  </label>

                  <input
                    type="text"
                    value={themeForm.name}
                    onChange={(e) =>
                      setThemeForm({
                        ...themeForm,
                        name: e.target.value
                      })
                    }
                    placeholder="e.g., My Theme"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>

                {/* Theme colour inputs */}
                <div className="grid grid-cols-2 gap-4">

                  {[
                    {
                      label: 'Primary (Income)',
                      key: 'primary'
                    },
                    {
                      label: 'Secondary (Expense)',
                      key: 'secondary'
                    },
                    {
                      label: 'Accent 1',
                      key: 'accent1'
                    },
                    {
                      label: 'Accent 2',
                      key: 'accent2'
                    },
                    {
                      label: 'Button Color',
                      key: 'buttonColor'
                    }
                  ].map((field: any) => (

                    <div key={field.key}>

                      <label className="block text-sm mb-2 text-gray-700 font-medium">
                        {field.label}
                      </label>

                      <div className="flex gap-2">

                        {/* Visual colour picker */}
                        <div className="relative w-12 h-10">

                          <input
                            type="color"
                            value={
                              themeForm[field.key] || '#1F2937'
                            }
                            onChange={(e) =>
                              setThemeForm({
                                ...themeForm,
                                [field.key]: e.target.value
                              })
                            }
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />

                          <div
                            className="w-12 h-10 rounded-full border-2 border-gray-200"
                            style={{
                              backgroundColor:
                                themeForm[field.key] || '#1F2937'
                            }}
                          />
                        </div>

                        {/* Manual HEX value input */}
                        <input
                          type="text"
                          value={
                            themeForm[field.key] || '#1F2937'
                          }
                          onChange={(e) =>
                            setThemeForm({
                              ...themeForm,
                              [field.key]: e.target.value
                            })
                          }
                          className="flex-1 px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form actions */}
                <div className="flex gap-3">

                  <button
                    onClick={handleSaveTheme}
                    className="flex-1 text-white py-2 px-4 rounded-lg transition-opacity font-medium"
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
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
                    {editingTheme
                      ? 'Update Theme'
                      : 'Create Theme'}
                  </button>

                  {/* Delete is only available for custom themes */}
                  {editingTheme &&
                    !isDefaultTheme(editingTheme) && (

                      <button
                        onClick={handleDeleteTheme}
                        className="px-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Trash2 className="w-4 h-4" />

                        Delete
                      </button>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}