import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, duration, interests, travelStyle, budget } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert travel planner with deep knowledge of destinations worldwide. Create detailed, practical, and exciting travel itineraries that balance must-see attractions with hidden gems and local experiences.

Your itineraries should:
- Be realistic with proper time allocations
- Include specific addresses or landmark names when possible
- Consider travel time between locations
- Mix popular attractions with unique local experiences
- Account for the traveler's interests and style
- Include meal recommendations
- Consider opening hours and best times to visit

Format your response as a JSON object with this structure:
{
  "destination": "City, Country",
  "summary": "A brief exciting overview of the trip",
  "days": [
    {
      "day": 1,
      "title": "Day theme/title",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity name",
          "description": "What you'll do and why it's special",
          "location": "Specific location/address",
          "duration": "2 hours",
          "type": "sightseeing" | "food" | "culture" | "adventure" | "relaxation" | "shopping" | "nightlife"
        }
      ],
      "tips": ["Practical tip for this day"]
    }
  ],
  "packingTips": ["Essential items to pack"],
  "budgetEstimate": {
    "accommodation": "$$",
    "food": "$$",
    "activities": "$$",
    "transport": "$$"
  },
  "bestTimeToVisit": "When and why"
}`;

    const userPrompt = `Create a ${duration}-day travel itinerary for ${destination}.

Traveler preferences:
- Interests: ${interests.join(", ")}
- Travel style: ${travelStyle}
- Budget level: ${budget}

Please create a comprehensive day-by-day schedule with activities from morning to evening. Make it exciting and memorable!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate itinerary");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Extract JSON from the response
    let itinerary;
    try {
      // Try to parse directly first
      itinerary = JSON.parse(content);
    } catch {
      // If that fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[1].trim());
      } else {
        // Last resort: find JSON object in the text
        const jsonStart = content.indexOf("{");
        const jsonEnd = content.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          itinerary = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
        } else {
          throw new Error("Could not parse itinerary from response");
        }
      }
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
