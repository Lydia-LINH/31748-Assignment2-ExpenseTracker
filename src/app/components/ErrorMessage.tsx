import { AlertCircle } from 'lucide-react';

export default function ErrorMessage(props: any) {
  const { errorMessage } = props;

  // if there is no error message, don't render anything
  if (!errorMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[120] animate-in fade-in slide-in-from-top-2">
      <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">{errorMessage}</span>
      </div>
    </div>
  );
}