import React from 'react';
import { X, Save, Trash2, DollarSign } from 'lucide-react';

export default function CategoryDialog(props: any) {
  const {
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    editingCategory,
    categoryForm,
    setCategoryForm,
    availableIcons,
    recommendedColors,
    currentTheme,
    categories,
    setCategories,
    transactions,
    showError,
    refreshCategories
  } = props;

  // Do not render the modal when it is closed.
  if (!isCategoryDialogOpen) {
    return null;
  }

  // Save a new or edited category to the backend database.
  const handleSaveToDatabase = async () => {
    if (!categoryForm.name) {
      showError('Please enter a category name');
      return;
    }

    const userStorage = localStorage.getItem('expense_user');

    let token = '';

    if (userStorage) {
      token = JSON.parse(userStorage).token || '';
    }

    const isEditing = editingCategory !== null;

    const url = isEditing
      ? `http://localhost:5000/api/categories/${editingCategory}`
      : 'http://localhost:5000/api/categories';

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: categoryForm.name,
          icon: categoryForm.icon,
          color: categoryForm.color
        })
      });

      if (response.ok) {
        // Update local category state immediately for a responsive UI.
        const iconComponent =
          availableIcons.find((i: any) => i.name === categoryForm.icon)
            ?.component || DollarSign;

        const newCategories = {
          ...categories
        };

        if (isEditing && editingCategory !== categoryForm.name) {
          delete newCategories[editingCategory];
        }

        newCategories[categoryForm.name] = {
          icon: iconComponent,
          color: categoryForm.color
        };

        setCategories(newCategories);
        setIsCategoryDialogOpen(false);

        // Refresh category data silently after database update.
        if (refreshCategories) {
          await refreshCategories();
        }
      } else {
        showError('Server rejected the saving request');
      }
    } catch (error) {
      console.error('Failed to save category to MongoDB:', error);
      showError('Network error. Failed to save to database.');
    }
  };

  // Delete a category from the backend database if it is not used by transactions.
  const handleDeleteFromDatabase = async () => {
    const hasTransactions = transactions.some(
      (t: any) => t.category === editingCategory
    );

    if (hasTransactions) {
      showError('Cannot delete category: transactions exist');
      return;
    }

    const userStorage = localStorage.getItem('expense_user');

    let token = '';

    if (userStorage) {
      token = JSON.parse(userStorage).token || '';
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${editingCategory}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        // Remove the deleted category from local UI state.
        const newCategories = {
          ...categories
        };

        delete newCategories[editingCategory];

        setCategories(newCategories);
        setIsCategoryDialogOpen(false);

        // Refresh category data silently after database update.
        if (refreshCategories) {
          await refreshCategories();
        }
      } else {
        showError('Failed to delete category from database');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      showError('Network error. Failed to delete.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={() => setIsCategoryDialogOpen(false)}
    >
      <div
        className="bg-white rounded-2xl w-[600px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp"
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
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </h2>

          <button
            onClick={() => setIsCategoryDialogOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category name input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Category Name
            </label>

            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  name: e.target.value
                })
              }
              placeholder="e.g., Groceries, Bills"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Icon selector */}
          <div>
            <label className="block text-sm mb-3 text-gray-700 font-medium">
              Select Icon
            </label>

            <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto p-2 border border-gray-200 rounded-lg">
              {availableIcons.map((icon: any) => {
                const IconComp = icon.component;

                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() =>
                      setCategoryForm({
                        ...categoryForm,
                        icon: icon.name
                      })
                    }
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 ${
                      categoryForm.icon === icon.name
                        ? 'border-gray-800 bg-gray-100'
                        : 'border-gray-200'
                    }`}
                    title={icon.label}
                  >
                    <IconComp className="w-5 h-5 text-gray-700 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-sm mb-3 text-gray-700 font-medium">
              Select Color
            </label>

            {/* Recommended color palette */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                Recommended Colors
              </p>

              <div className="space-y-3">
                {Array.from(
                  {
                    length: Math.ceil(recommendedColors.length / 10)
                  },
                  (_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-center gap-10"
                    >
                      <div className="flex gap-2">
                        {recommendedColors
                          .slice(rowIndex * 10, rowIndex * 10 + 5)
                          .map((color: string) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                setCategoryForm({
                                  ...categoryForm,
                                  color
                                })
                              }
                              className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 ${
                                categoryForm.color === color
                                  ? 'border-gray-800 scale-110 ring-2 ring-gray-800 ring-offset-1'
                                  : 'border-gray-200 hover:scale-105 hover:border-gray-300'
                              }`}
                              style={{
                                backgroundColor: color
                              }}
                            />
                          ))}
                      </div>

                      {recommendedColors.slice(
                        rowIndex * 10 + 5,
                        rowIndex * 10 + 10
                      ).length > 0 && (
                        <div className="flex gap-2">
                          {recommendedColors
                            .slice(rowIndex * 10 + 5, rowIndex * 10 + 10)
                            .map((color: string) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() =>
                                  setCategoryForm({
                                    ...categoryForm,
                                    color
                                  })
                                }
                                className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 ${
                                  categoryForm.color === color
                                    ? 'border-gray-800 scale-110 ring-2 ring-gray-800 ring-offset-1'
                                    : 'border-gray-200 hover:scale-105 hover:border-gray-300'
                                }`}
                                style={{
                                  backgroundColor: color
                                }}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Custom color picker */}
            <div>
              <p className="text-xs text-gray-500 mb-2">
                Custom Color
              </p>

              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        color: e.target.value
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <div
                    className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: categoryForm.color
                    }}
                  />
                </div>

                <input
                  type="text"
                  value={categoryForm.color}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      color: e.target.value
                    })
                  }
                  className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 focus:outline-none transition-all duration-200 font-mono text-sm placeholder:text-gray-400"
                  placeholder="#409BD8"
                />
              </div>
            </div>

            {/* Category preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                Preview
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-12 rounded-full"
                  style={{
                    backgroundColor: categoryForm.color
                  }}
                />

                {(() => {
                  const PreviewIcon =
                    availableIcons.find(
                      (i: any) => i.name === categoryForm.icon
                    )?.component || DollarSign;

                  return (
                    <PreviewIcon
                      className="w-6 h-6"
                      style={{
                        color: categoryForm.color
                      }}
                      strokeWidth={1.5}
                    />
                  );
                })()}

                <span
                  className="font-medium text-gray-900"
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif'
                  }}
                >
                  {categoryForm.name || 'Category Name'}
                </span>
              </div>
            </div>
          </div>

          {/* Dialog actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveToDatabase}
              className="flex-1 text-white py-3 px-4 rounded-xl font-bold tracking-tight shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                backgroundColor: currentTheme.buttonColor || '#1F2937'
              }}
            >
              <Save className="w-4 h-4 inline mr-2" />
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>

            {editingCategory && (
              <button
                onClick={handleDeleteFromDatabase}
                className="px-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}