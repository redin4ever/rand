import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Heart, Wallet, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const interests = [
  { id: "culture", label: "Culture & History", emoji: "🏛️" },
  { id: "food", label: "Food & Dining", emoji: "🍽️" },
  { id: "adventure", label: "Adventure", emoji: "🏔️" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "relaxation", label: "Relaxation", emoji: "🧘" },
  { id: "photography", label: "Photography", emoji: "📸" },
];

const travelStyles = [
  { id: "budget", label: "Budget-Friendly", icon: "💰" },
  { id: "comfort", label: "Comfortable", icon: "✨" },
  { id: "luxury", label: "Luxury", icon: "👑" },
];

const budgetLevels = [
  { id: "low", label: "$", description: "Budget" },
  { id: "medium", label: "$$", description: "Moderate" },
  { id: "high", label: "$$$", description: "Splurge" },
];

interface TripFormProps {
  onSubmit: (data: {
    destination: string;
    duration: number;
    interests: string[];
    travelStyle: string;
    budget: string;
  }) => void;
  isLoading: boolean;
}

export const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("comfort");
  const [budget, setBudget] = useState("medium");

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || selectedInterests.length === 0) return;
    onSubmit({
      destination: destination.trim(),
      duration,
      interests: selectedInterests,
      travelStyle,
      budget,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto px-4"
    >
      <div className="bg-card rounded-2xl shadow-soft p-6 md:p-8 space-y-8">
        {/* Destination */}
        <div className="space-y-3">
          <Label htmlFor="destination" className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="text-primary" size={20} />
            Where do you want to go?
          </Label>
          <Input
            id="destination"
            placeholder="e.g., Tokyo, Japan or Paris, France"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="text-lg h-14 px-5"
            required
          />
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="text-primary" size={20} />
            How many days?
          </Label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="14"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-2xl font-bold text-primary min-w-[60px] text-center">
              {duration} {duration === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Heart className="text-primary" size={20} />
            What are you interested in?
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interests.map((interest) => (
              <motion.button
                key={interest.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all duration-200 text-left",
                  selectedInterests.includes(interest.id)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-secondary"
                )}
              >
                <span className="text-xl">{interest.emoji}</span>
                <p className="text-sm font-medium mt-1">{interest.label}</p>
              </motion.button>
            ))}
          </div>
          {selectedInterests.length === 0 && (
            <p className="text-sm text-muted-foreground">Select at least one interest</p>
          )}
        </div>

        {/* Travel Style */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Plane className="text-primary" size={20} />
            Travel Style
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {travelStyles.map((style) => (
              <motion.button
                key={style.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTravelStyle(style.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                  travelStyle === style.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary"
                )}
              >
                <span className="text-2xl">{style.icon}</span>
                <p className="text-sm font-medium mt-1">{style.label}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="text-primary" size={20} />
            Budget Level
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {budgetLevels.map((level) => (
              <motion.button
                key={level.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBudget(level.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                  budget === level.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary"
                )}
              >
                <span className="text-xl font-bold">{level.label}</span>
                <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          disabled={!destination.trim() || selectedInterests.length === 0 || isLoading}
          className="w-full h-14 text-lg font-semibold gradient-hero hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ✈️
              </motion.span>
              Planning your adventure...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plane size={20} />
              Generate My Itinerary
            </span>
          )}
        </Button>
      </div>
    </motion.form>
  );
};
