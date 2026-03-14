import { useState } from "react";
import { Hero } from "@/components/Hero";
import { TripForm } from "@/components/TripForm";
import { Itinerary } from "@/components/Itinerary";
import { toast } from "sonner";

interface ItineraryData {
  destination: string;
  summary: string;
  days: Array<{
    day: number;
    title: string;
    activities: Array<{
      time: string;
      title: string;
      description: string;
      location: string;
      duration: string;
      type: string;
    }>;
    tips: string[];
  }>;
  packingTips: string[];
  budgetEstimate: {
    accommodation: string;
    food: string;
    activities: string;
    transport: string;
  };
  bestTimeToVisit: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);

  const handleSubmit = async (formData: {
    destination: string;
    duration: number;
    interests: string[];
    travelStyle: string;
    budget: string;
  }) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (response.status === 402) {
          toast.error("Usage limit reached. Please try again later.");
        } else {
          toast.error(errorData.error || "Failed to generate itinerary");
        }
        return;
      }

      const data = await response.json();
      setItinerary(data.itinerary);
      toast.success("Your itinerary is ready! 🎉");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
  };

  return (
    <main className="min-h-screen">
      {!itinerary ? (
        <>
          <Hero />
          <section className="py-12 -mt-8 relative z-20">
            <TripForm onSubmit={handleSubmit} isLoading={isLoading} />
          </section>
        </>
      ) : (
        <section className="py-12 gradient-sunset min-h-screen">
          <Itinerary data={itinerary} onReset={handleReset} />
        </section>
      )}
    </main>
  );
};

export default Index;
