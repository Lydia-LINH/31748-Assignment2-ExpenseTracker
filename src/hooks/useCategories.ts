import { useState, useEffect } from 'react';

// Icons are dynamically matched against category records returned from MongoDB.
import { availableIcons } from '../constants/data';

export function useCategories() {

  // Centralised category state.
  const [categories, setCategories] =
    useState<Record<string, any>>({});

  useEffect(() => {

    // Load category configuration for the currently authenticated user.
    // Categories are fetched once during initial application bootstrap.
    const loadData = async () => {

      // Retrieve persisted login session from local storage.
      const userStorage =
        localStorage.getItem('expense_user');

      if (!userStorage) {
        return;
      }

      const token =
        JSON.parse(userStorage).token;

      try {

        // Protected API request using JWT authentication.
        const response = await fetch(
          'http://localhost:5000/api/categories',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {

          const dbCategories =
            await response.json();

          // lookup object for fast rendering and category access.
          if (dbCategories.length > 0) {

            const formatted: Record<string, any> = {};

            dbCategories.forEach((item: any) => {

              // Match icon string from database with actual React icon component.
              const foundIcon =
                availableIcons.find(
                  (i: any) => i.name === item.icon
                )?.component;

              formatted[item.name] = {

                // Fallback to the first available icon if no match exists.
                icon:
                  foundIcon ||
                  availableIcons[0].component,

                // Fallback colour used as a defensive safeguard.
                color:
                  item.color || '#111827'
              };
            });

            // Replace temporary local state with database-driven categories.
            setCategories(formatted);
          }
        }
      } catch (error) {

        // Network or backend request failure logging.
        console.error(
          'Fetch categories error:',
          error
        );
      }
    };

    loadData();

  }, []);

  // Expose both category state and setter for external UI updates.
  return {
    categories,
    setCategories
  };
}