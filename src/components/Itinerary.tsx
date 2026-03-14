import { motion } from "framer-motion";
import { 
  MapPin, Clock, Lightbulb, Backpack, DollarSign, Sun,
  Camera, Utensils, Landmark, Mountain, Moon, ShoppingBag, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  type: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
  tips: string[];
}

interface ItineraryData {
  destination: string;
  summary: string;
  days: Day[];
  packingTips: string[];
  budgetEstimate: {
    accommodation: string;
    food: string;
    activities: string;
    transport: string;
  };
  bestTimeToVisit: string;
}

interface ItineraryProps {
  data: ItineraryData;
  onReset: () => void;
}

const typeIcons: Record<string, typeof Camera> = {
  sightseeing: Camera,
  food: Utensils,
  culture: Landmark,
  adventure: Mountain,
  relaxation: Sparkles,
  shopping: ShoppingBag,
  nightlife: Moon,
};

const typeColors: Record<string, string> = {
  sightseeing: "bg-ocean/10 text-ocean border-ocean/20",
  food: "bg-accent/10 text-accent border-accent/20",
  culture: "bg-primary/10 text-primary border-primary/20",
  adventure: "bg-success/10 text-success border-success/20",
  relaxation: "bg-muted text-muted-foreground border-border",
  shopping: "bg-pink-100 text-pink-600 border-pink-200",
  nightlife: "bg-purple-100 text-purple-600 border-purple-200",
};

export const Itinerary = ({ data, onReset }: ItineraryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 pb-20"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Your Trip to{" "}
          <span className="text-gradient">{data.destination}</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {data.summary}
        </p>
      </motion.div>

      {/* Quick Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
      >
        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Sun className="text-accent" size={24} />
            <h3 className="font-semibold">Best Time to Visit</h3>
          </div>
          <p className="text-sm text-muted-foreground">{data.bestTimeToVisit}</p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-success" size={24} />
            <h3 className="font-semibold">Budget Estimate</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🏨 Stay: {data.budgetEstimate.accommodation}</p>
            <p>🍽️ Food: {data.budgetEstimate.food}</p>
            <p>🎟️ Activities: {data.budgetEstimate.activities}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Backpack className="text-primary" size={24} />
            <h3 className="font-semibold">Packing Tips</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {data.packingTips.slice(0, 3).map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Day by Day Itinerary */}
      <div className="space-y-8">
        {data.days.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + dayIndex * 0.1 }}
            className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden"
          >
            {/* Day Header */}
            <div className="gradient-hero p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-primary-foreground/80 text-sm font-medium">
                    Day {day.day}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-primary-foreground mt-1">
                    {day.title}
                  </h3>
                </div>
                <div className="text-4xl font-display font-bold text-primary-foreground/30">
                  {String(day.day).padStart(2, "0")}
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="p-6 space-y-4">
              {day.activities.map((activity, actIndex) => {
                const IconComponent = typeIcons[activity.type] || Camera;
                const colorClass = typeColors[activity.type] || typeColors.sightseeing;

                return (
                  <motion.div
                    key={actIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + actIndex * 0.05 }}
                    className="flex gap-4"
                  >
                    {/* Time */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <span className="text-sm font-bold text-primary">{activity.time}</span>
                    </div>

                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", colorClass)}>
                        <IconComponent size={18} />
                      </div>
                      {actIndex < day.activities.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <h4 className="font-semibold text-lg">{activity.title}</h4>
                      <p className="text-muted-foreground mt-1">{activity.description}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {activity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {activity.duration}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Day Tips */}
              {day.tips && day.tips.length > 0 && (
                <div className="mt-6 p-4 bg-secondary rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground mb-2">
                    <Lightbulb size={16} className="text-accent" />
                    Pro Tips
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {day.tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reset Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Plan Another Trip
        </button>
      </motion.div>
    </motion.div>
  );
};
