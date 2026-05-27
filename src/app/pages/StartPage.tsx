import React from 'react';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck
} from 'lucide-react';

export default function StartPage(props: any) {
  const {
    isLoggedIn,
    setIsAuthDialogOpen,
    userName,
    currentTheme
  } = props;

  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[450px] animate-fadeIn">

      {/* Decorative icon group */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center -rotate-12 shadow-sm">
          <PieChart className="w-6 h-6 text-blue-500" />
        </div>

        <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-xl z-10 scale-110">
          <Wallet className="w-8 h-8 text-white" />
        </div>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center rotate-12 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Welcome text section */}
      <div className="max-w-md">
        <h2
          className="text-3xl font-black text-gray-900 mb-4"
          style={{
            fontFamily: '"Space Grotesk", sans-serif'
          }}
        >
          {isLoggedIn
            ? `Hey ${userName}, Ready to Save?`
            : 'Smart Money, Better Life.'}
        </h2>

        <p className="text-gray-500 text-lg leading-relaxed mb-10">
          {isLoggedIn
            ? 'Your dashboard is waiting for some data! Add your first transaction to unlock deep insights into your spending habits.'
            : 'The most minimal and secure way to track your daily expenses. Join our community of smart savers at UTS today.'}
        </p>
      </div>

      {/* Interactive action area */}
      {isLoggedIn ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-full font-bold animate-pulse">
            <Sparkles className="w-5 h-5" />

            <span>
              Click the "+" button to start!
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Recording transactions helps you visualize your budget.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsAuthDialogOpen(true)}
          className="group text-white px-10 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-2xl transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor:
              currentTheme?.buttonColor || '#1F2937',
            fontFamily: '"Space Grotesk", sans-serif'
          }}
        >
          Get Started Now

          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Bottom feature labels */}
      <div className="mt-12 pt-8 border-t border-gray-50 w-full grid grid-cols-3 gap-4 text-[10px] uppercase tracking-widest font-black text-gray-300">
        <div>Secure JWT</div>
        <div>Real-time Data</div>
        <div>Cloud Sync</div>
      </div>
    </div>
  );
}