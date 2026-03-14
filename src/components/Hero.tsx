import { motion } from "framer-motion";
import { MapPin, Compass, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-20 left-[10%] text-primary-foreground/30"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Compass size={48} />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-[15%] text-primary-foreground/40"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MapPin size={36} />
      </motion.div>

      <div className="container relative z-10 px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-sm text-primary text-sm font-medium shadow-soft">
            <Sparkles size={16} />
            AI-Powered Travel Planning
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground"
        >
          Your Perfect Trip,{" "}
          <span className="text-gradient">Instantly Planned</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Tell us where you want to go and what you love to do. Our AI creates a personalized day-by-day itinerary in seconds.
        </motion.p>
      </div>
    </section>
  );
};
