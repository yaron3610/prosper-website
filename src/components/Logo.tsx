import React from 'react';
import { motion } from 'motion/react';

export const Logo = ({ className = "h-10" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Abstract representation of parents hugging a child */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-200" />
          
          {/* Parent 1 */}
          <motion.path
            d="M30 70 Q30 40 50 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-brand-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          
          {/* Parent 2 */}
          <motion.path
            d="M70 70 Q70 40 50 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-brand-600"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          
          {/* Child */}
          <motion.circle
            cx="50"
            cy="55"
            r="8"
            fill="currentColor"
            className="text-brand-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
          />
        </motion.svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-brand-900">PROSPER</span>
        <span className="text-[10px] uppercase tracking-widest text-brand-600 font-medium">Science for Parents</span>
      </div>
    </div>
  );
};
