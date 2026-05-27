import {
  WifiOff,
  RefreshCw
} from 'lucide-react';

export default function NetworkError(props: any) {

  const {
    currentTheme,
    setHasNetworkError
  } = props;

  return (

    <div
      className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center animate-fadeIn"
      style={{
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >

      {/* Main container */}
      <div className="text-center max-w-md px-8 animate-slideUp">

        {/* Error icon */}
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100">
          <WifiOff className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-bold text-gray-900 mb-4 tracking-tight"
          style={{
            fontFamily:
              '"Space Grotesk", sans-serif'
          }}
        >
          No Internet Connection
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Please check your network connection and try again.
          Make sure you're connected to the internet.
        </p>

        {/* Retry button */}
        <button
          onClick={() => {

            setHasNetworkError(!navigator.onLine);

            if (navigator.onLine) {
              window.location.reload();
            }
          }}

          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"

          style={{
            fontFamily:
              '"Space Grotesk", sans-serif',

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

          <RefreshCw className="w-5 h-5" />

          Try Again

        </button>

      </div>

    </div>
  );
}