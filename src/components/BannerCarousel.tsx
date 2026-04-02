import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  const banners = [
    {
      id: 1,
      title: "PUBG Mobile Season 20",
      subtitle: { uz: "Hozir to'ldiring va 20% bonus UC oling!", ru: "Пополните сейчас и получите 20% бонусных UC!", en: "Top up now and get 20% bonus UC instantly!" },
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      cta: t.banner.topUpNow,
      link: "/games/pubg-mobile"
    },
    {
      id: 2,
      title: "Genshin Impact 4.0",
      subtitle: { uz: "Yangi yangilanish uchun Genesis Cristallarni darhol oling.", ru: "Получите Genesis Crystals мгновенно для нового обновления.", en: "Get Genesis Crystals instantly for the new update." },
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2184&auto=format&fit=crop",
      cta: t.banner.getCrystals,
      link: "/games/genshin-impact"
    },
    {
      id: 3,
      title: "Mobile Legends Starlight",
      subtitle: { uz: "Bu oy eksklyuziv skinlar va mukofotlarni oching.", ru: "Откройте эксклюзивные скины и награды в этом месяце.", en: "Unlock exclusive skins and rewards this month." },
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop",
      cta: t.banner.buyStarlight,
      link: "/games/mobile-legends"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const currentBanner = banners[currentIndex];
  const { lang } = useLanguage();
  const subtitle = currentBanner.subtitle[lang];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black/20 aspect-[16/9] md:aspect-[21/7] lg:aspect-[21/6] touch-pan-y">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) nextSlide();
            else if (offset.x > 50) prevSlide();
          }}
        >
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
            src={currentBanner.image}
            alt={currentBanner.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base/95 via-bg-base/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-16 lg:px-24">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-text-main mb-2 md:mb-4 max-w-2xl"
            >
              {currentBanner.title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-lg text-text-muted mb-6 max-w-xl font-medium"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to={currentBanner.link}
                className="inline-block bg-accent active:bg-accent-hover active:scale-95 text-white font-bold py-3 px-8 rounded-full transition-all"
              >
                {currentBanner.cta}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-text-muted/50 active:bg-text-muted/80'}`}
          />
        ))}
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 active:bg-black/40 text-white backdrop-blur-sm transition-colors hidden md:block"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 active:bg-black/40 text-white backdrop-blur-sm transition-colors hidden md:block"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
