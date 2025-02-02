// API endpoints
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export type AIProvider = "deepseek" | "gemini";

interface AIResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

function extractJsonFromMarkdown(text: string): string {
  console.log("Attempting to extract JSON from text:", text);
  // Remove markdown code blocks and any other formatting
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    console.log("Found JSON in markdown block:", jsonMatch[1].trim());
    return jsonMatch[1].trim();
  }
  console.log("No markdown blocks found, returning cleaned text");
  return text.trim();
}

function cleanNumberRanges(jsonString: string): string {
  // Replace number ranges with their average value
  return jsonString.replace(/"reps":\s*(\d+)-(\d+)/g, (match, start, end) => {
    const average = Math.round((Number(start) + Number(end)) / 2);
    return `"reps": ${average}`;
  });
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 30000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function generateWorkoutTemplate(prompt: string, provider: AIProvider = "deepseek"): Promise<string> {
  try {
    console.log(`\n=== Making request to ${provider} API ===`);
    console.log("Prompt:", prompt);
    
    if (provider === "deepseek") {
      const requestBody = {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a professional fitness coach specializing in creating personalized workout programs. Create workout templates with active training days only - do not include rest days. You provide responses in JSON format that match the specified TypeScript interfaces.",
          },
          {
            role: "user",
            content: `${prompt}

The response must be a valid JSON object matching this interface:

interface Template {
  name: string;
  workouts: Array<{
    id: string;
    name: string;
    exercises: Array<{
      id: string;
      name: string;
      sets: number,
      reps: number,
      bodyPart: string;
      description: string;
    }>;
  }>;
}

IMPORTANT RULES:
1. Only include active workout days in the template
2. Do not include rest days in the workouts array
3. Each workout must have at least 3 exercises
4. Each exercise must have a meaningful description including rest times
5. Use descriptive IDs that indicate the day and target (e.g., "day1-chest", "day2-back")
6. Respond ONLY with the JSON object, no additional text or formatting`,
          },
        ],
        stream: false,
      };

      console.log("\nDeepSeek Request:", JSON.stringify(requestBody, null, 2));

      try {
        const response = await fetchWithTimeout(
          DEEPSEEK_API_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
          },
          30000 // 30 second timeout
        );

        console.log("\nDeepSeek Response Status:", response.status);
        console.log("DeepSeek Response Headers:", Object.fromEntries([...response.headers]));

        if (!response.ok) {
          const errorText = await response.text();
          console.error("\nDeepSeek Error Response:", errorText);
          throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const responseText = await response.text();
        if (!responseText || responseText.trim().length === 0) {
          console.error("\nEmpty response from DeepSeek API");
          throw new Error("Empty response from API");
        }

        console.log("\nDeepSeek Raw Response:", responseText);

        try {
          const data: AIResponse = JSON.parse(responseText);
          const content = data.choices?.[0]?.message?.content;
          if (!content) {
            throw new Error("No content in response");
          }
          
          const extractedJson = extractJsonFromMarkdown(content);
          if (!extractedJson || extractedJson.trim().length === 0) {
            throw new Error("Empty JSON content");
          }
          
          console.log("\nExtracted JSON from DeepSeek:", extractedJson);
          
          // Clean up number ranges before parsing
          const contentWithFixedRanges = cleanNumberRanges(extractedJson);
          console.log("\nContent with fixed ranges:", contentWithFixedRanges);
          
          const validatedJson = JSON.parse(contentWithFixedRanges);
          return JSON.stringify(validatedJson);
        } catch (parseError) {
          console.error("\nError parsing DeepSeek JSON response:", parseError);
          throw new Error("Failed to parse API response");
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("Request timed out after 30 seconds");
        }
        throw error;
      }
    } else {
      // Gemini API
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Create a workout program based on these requirements: ${prompt}

The response must be a valid JSON object matching this interface:

interface Template {
  name: string;
  workouts: Array<{
    id: string;
    name: string;
    exercises: Array<{
      id: string;
      name: string;
      sets: number,
      reps: number,
      bodyPart: string;
      description: string;
    }>;
  }>;
}

IMPORTANT RULES:
1. Only include active workout days in the template
2. Do not include rest days in the workouts array
3. Each workout must have at least 3 exercises
4. Each exercise must have a meaningful description including rest times
5. Use descriptive IDs that indicate the day and target (e.g., "day1-chest", "day2-back")`,
              },
            ],
          },
        ],
      };

      const response = await fetch(
        `${GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("\nGemini Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("\nGemini Error Response:", errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const responseText = await response.text();
      console.log("\nGemini Raw Response:", responseText);

      try {
        const data = JSON.parse(responseText);
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
          throw new Error("No content in Gemini response");
        }

        const cleanedContent = extractJsonFromMarkdown(content);
        console.log("\nCleaned Gemini content:", cleanedContent);
        
        // Clean up number ranges before parsing
        const contentWithFixedRanges = cleanNumberRanges(cleanedContent);
        console.log("\nContent with fixed ranges:", contentWithFixedRanges);
        
        const validatedJson = JSON.parse(contentWithFixedRanges);
        return JSON.stringify(validatedJson);
      } catch (parseError) {
        console.error("\nError parsing Gemini response:", parseError);
        throw new Error("Failed to parse Gemini response");
      }
    }
  } catch (error) {
    console.error(`\nError calling ${provider} API:`, error);
    throw error;
  }
} 