import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import SmartVerdictSection from "@/components/SmartVerdictSection";
import CategoryPills from "@/components/CategoryPills";
import SmartInsightCard from "@/components/SmartInsightCard";
import TodayBestDrops from "@/components/TodayBestDrops";
import BuyOrWaitPicks from "@/components/BuyOrWaitPicks";
import DealsUnderBudget from "@/components/DealsUnderBudget";
import SavingsCard from "@/components/SavingsCard";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import { useCategories } from "@/hooks/useCategories";

const Home = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories } = useCategories();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory((prev) => (prev === id ? "" : id));
  };

  const sectionDelay = (i: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: showSplash ? 0 : 1, y: showSplash ? 18 : 0 },
    transition: { delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="min-h-screen bg-background"
      >
        {/* ───── 1. HEADER ───── */}
        <motion.header
          className={`sticky top-0 z-40 bg-background/95 backdrop-blur-md transition-shadow duration-300 ${
            isScrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="max-w-lg mx-auto px-4 pt-12 pb-3">
            <div className="flex items-center justify-between mb-4">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? -20 : 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl font-semibold text-foreground tracking-tight"
              >
                ShopXAI
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showSplash ? 0 : 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="p-2.5 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </button>
              </motion.div>
            </div>

            {/* ───── 2. SEARCH BAR ───── */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </motion.header>

        {/* ───── MAIN CONTENT ───── */}
        <main className="max-w-lg mx-auto px-4 pb-28 space-y-7 mt-2">
          {/* 3. CATEGORY CHIPS */}
          <motion.section {...sectionDelay(0)}>
            <CategoryPills
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </motion.section>

          {/* 4. PASTE LINK → SMART VERDICT */}
          <motion.section {...sectionDelay(1)}>
            <SmartVerdictSection />
          </motion.section>

          {/* 5. SMART INSIGHT */}
          <motion.section {...sectionDelay(2)}>
            <SmartInsightCard />
          </motion.section>

          {/* 5. TODAY'S BEST DROPS */}
          <motion.section {...sectionDelay(2)}>
            <TodayBestDrops selectedCategory={selectedCategory} />
          </motion.section>

          {/* 6. BUY OR WAIT */}
          <motion.section {...sectionDelay(3)}>
            <BuyOrWaitPicks selectedCategory={selectedCategory} />
          </motion.section>

          {/* 7. DEALS UNDER BUDGET */}
          <motion.section {...sectionDelay(4)}>
            <DealsUnderBudget selectedCategory={selectedCategory} />
          </motion.section>

          {/* 8. SAVINGS CARD */}
          <motion.section {...sectionDelay(5)}>
            <SavingsCard />
          </motion.section>

          {/* 9. FOOTER TRUST NOTE */}
          <motion.footer
            {...sectionDelay(6)}
            className="text-center pt-2 pb-4"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prices tracked across Amazon, Flipkart & 100+ stores.
            </p>
          </motion.footer>
        </main>

        <BottomNav />
      </motion.div>
    </>
  );
};

export default Home;
