import type { Template } from "../store/workoutStore";

interface GenerateTemplateParams {
  experienceLevel: string;
  splitType: string;
  trainingFrequency: number;
  trainingGoal: string;
  equipment: string[];
  sessionDuration: number;
  limitations?: string;
}

export function generateAIPrompt({
  experienceLevel,
  splitType,
  trainingFrequency,
  trainingGoal,
  equipment,
  sessionDuration,
  limitations,
}: GenerateTemplateParams): string {
  return `Create a workout template for a trainee with the following specifications:

Experience Level: ${experienceLevel}
Split Type: ${splitType}
Training Frequency: ${trainingFrequency} days per week
Training Goal: ${trainingGoal}
Available Equipment: ${equipment.join(", ")}
Time per Session: ${sessionDuration} minutes
${limitations ? `Limitations/Injuries: ${limitations}` : "No specific limitations"}

The template should follow this TypeScript interface:

interface Template {
  name: string;
  workouts: Array<{
    id: string;
    name: string;
    exercises: Array<{
      id: string;
      name: string;
      sets: number;
      reps: number;
      bodyPart: string;
    }>;
  }>;
}

Requirements:
1. Exercise selection should be appropriate for the experience level and available equipment
2. Number of sets and reps should follow proper progressive overload principles and align with the training goal
3. Rest times between sets should be included in the exercise description
4. Include a mix of compound and isolation exercises appropriate for the goal
5. Exercises should be ordered from most to least demanding
6. Include proper warm-up recommendations
7. Total workout duration should fit within the specified session duration
8. If limitations are specified, avoid exercises that could aggravate them
9. Format the response as a valid JSON object that matches the Template interface

Please provide a complete, well-structured workout template that can be parsed as JSON.`;
}

export function parseAIResponse(response: string): Template {
  try {
    // Clean up the response string
    const cleanResponse = response.trim();
    
    // Try to parse the entire response first
    try {
      const template = JSON.parse(cleanResponse);
      return {
        ...template,
        id: Date.now().toString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } catch (directParseError) {
      console.log("Direct parse failed, trying to extract JSON...");
    }

    // If direct parsing fails, try to find a JSON object
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON object found in response");
    }

    const template = JSON.parse(jsonMatch[0]);
    
    // Validate the template structure
    if (!template.name || !Array.isArray(template.workouts)) {
      throw new Error("Invalid template structure: missing required fields");
    }

    // Add required fields
    return {
      ...template,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw error;
  }
} 