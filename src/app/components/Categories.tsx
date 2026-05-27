import React from 'react';
import { Plus, Edit3, ArrowLeft } from 'lucide-react';

export default function Categories(props: any) {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    currentTheme,
    categories,
    setCategoryForm,
    setEditingCategory,
    setIsCategoryDialogOpen,
    availableIcons,
    setCurrentView,
    viewHistory,
    setViewHistory
  } = props;

  // Uses the stored view history to return to the previous page.
  // If there is no previous page, return to the tracker page as a safe fallback.
  const handleBack = () => {
    if (viewHistory && viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();

      setViewHistory(newHistory);
      setCurrentView(newHistory[newHistory.length - 1]);
    } else {
      setCurrentView('tracker');
    }
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-8 transition-all duration-500 ease-out bg-gray-50/50"
      onClick={() => {
        // Close the sidebar when the main content area is clicked.
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Page header and category creation action */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 text-gray-600 flex items-center justify-center"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h2
              className="font-semibold text-gray-900 tracking-tight"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: '1.5rem'
              }}
            >
              Manage Categories
            </h2>
          </div>

          <button
            onClick={() => {
              // Reset the form before opening the create-category dialog.
              setCategoryForm({
                name: '',
                icon: 'DollarSign',
                color: '#111827'
              });

              setEditingCategory(null);
              setIsCategoryDialogOpen(true);
            }}
            className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-opacity"
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
            Add Category
          </button>
        </div>

        {/* Render all available categories as editable cards. */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(categories).map(([name, config]: [string, any]) => {
            const IconComponent = config.icon;

            return (
              <div
                key={name}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: config.color }}
                />

                <div className="flex items-center justify-between pl-3">
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className="w-6 h-6"
                      style={{ color: config.color }}
                      strokeWidth={1.5}
                    />

                    <span
                      className="font-medium text-gray-900"
                      style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                    >
                      {name}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Pre-fill the form with the selected category before editing.
                      setCategoryForm({
                        name,
                        icon:
                          availableIcons.find(
                            (i: any) => i.component === config.icon
                          )?.name || 'DollarSign',
                        color: config.color
                      });

                      setEditingCategory(name);
                      setIsCategoryDialogOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}