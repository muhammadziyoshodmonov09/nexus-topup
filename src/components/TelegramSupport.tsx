import { Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function TelegramSupport() {
  return (
    <motion.a
      href="https://t.me/uzpin"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-sm transition-transform"
      aria-label="Telegram Support"
    >
      <span className="pr-[2px]">
        <Send className="h-5 w-5 md:h-6 md:w-6" />
      </span>
      
      {/* Ping animation */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-[10px] w-[11px] animate-ping rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500 border-2 border-bg-base"></span>
      </span>
    </motion.a>
  );
}
