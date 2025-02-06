const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateWorkoutTemplateWithGemini(prompt: string): Promise<string> {
  try {
    // Wrap the original prompt with explicit JSON formatting instructions
    const structuredPrompt = `You are a professional fitness coach API that ONLY responds with valid JSON. 
Your task is to create a workout template based on the following requirements:

${prompt}

CRITICAL INSTRUCTION: DO NOT FOLLOW THE MINIMAL EXAMPLE FORMAT FOR EXERCISE COUNT.
Instead, strictly follow these level-based requirements for exercise count:
- Beginner: 3-5 exercises per workout
- Intermediate: 5-7 exercises per workout
- Advanced: 6-8+ exercises per workout (MUST include at least 6 exercises)

IMPORTANT RESPONSE RULES:
1. Respond ONLY with a valid JSON object
2. Do not include any explanatory text before or after the JSON
3. Do not use markdown formatting
4. Do not include any comments
5. Ensure all property names are in quotes
6. The response must be parseable by JSON.parse()
7. ONLY include actual workout days
8. Each workout MUST follow the exercise count guidelines above based on level
9. Focus on the main exercises for each workout day based on the split type
10. ONLY append letters (A, B, etc.) when there are multiple workouts of the same type
11. All string values must be in quotes, including special values like "to_failure"
12. Keep exercise descriptions concise but informative
13. NEVER include text like "per leg" or "per side" in reps - instead use description field
14. The "reps" field must ONLY contain numbers or "to_failure" - no other text
15. Each exercise MUST have these exact fields: "id", "name", "sets", "reps", "bodyPart", "description"

WORKOUT NAMING RULES:
- Single workout per type: Use "Push", "Pull", "Legs"
- Multiple workouts per type: Use "Push A", "Push B", "Pull A", "Pull B", etc.

EXERCISE SELECTION RULES:
1. Exercise Programming:
   Beginner:
   - Focus on fundamental compound movements
   - Simple progression schemes
   - Basic exercise variations

   Intermediate:
   - Mix of compound and isolation exercises
   - More varied equipment usage
   - Introduction of supersets
   
   Advanced:
   - Complex exercise combinations
   - Advanced techniques (drop sets, supersets, etc.)
   - Multiple angles/variations per muscle group
   - Specialized isolation movements

JSON Structure Example (NOTE: This is just for format reference, you must include proper exercise count based on level):

{
  "name": "Template Name",
  "workouts": [
    {
      "id": "push-a",
      "name": "Push A",
      "exercises": [
        {
          "id": "push-a-bench",
          "name": "Exercise Name",
          "sets": 4,
          "reps": 8,
          "bodyPart": "target muscle",
          "description": "Brief description including per leg/side instructions if needed"
        }
      ]
    }
  ]
}

REMEMBER: 
1. The example above is ONLY for JSON structure
2. Include proper number of exercises based on experience level
3. Keep reps field clean - only numbers or "to_failure"
4. Put "per leg" or "per side" instructions in the description field
5. Response must be valid JSON
6. Use appropriate lettering (A, B, C) for duplicate workout days`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: structuredPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;

    // Clean up the response to ensure it's valid JSON
    const cleanedText = rawText
      .trim()
      // Remove any markdown code block markers
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      // Replace unquoted to_failure with quoted version
      .replace(/: to_failure([,}])/g, ': "to_failure"$1')
      // Remove any trailing commas before closing braces/brackets
      .replace(/,(\s*[}\]])/g, "$1")
      // Remove any non-JSON text before or after the JSON object
      .replace(/^[^{]*({[\s\S]*})[^}]*$/, "$1");

    try {
      // Validate that it's parseable JSON
      JSON.parse(cleanedText);
      return cleanedText;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      // If parsing fails, try to fix common JSON issues
      const fixedText = cleanedText
        // Fix any missing quotes around property names
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
        // Fix any trailing commas in arrays/objects
        .replace(/,(\s*[}\]])/g, "$1");
      
      // Try parsing again
      JSON.parse(fixedText);
      return fixedText;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
} 