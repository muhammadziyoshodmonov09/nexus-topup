import { motion } from 'motion/react';
import { ReactNode } from 'react';

export default function PageTransition({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, scale: 0.99, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex-1 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}
