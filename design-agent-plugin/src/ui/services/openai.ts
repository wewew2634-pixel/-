import { SYSTEM_PROMPT, M3_SPEC_PROMPT_ADDENDUM } from '../../common/prompt';
import { DesignSystemSchema, ComponentNodeSchema } from '../../common/schema';
import { z } from 'zod';

const ResponseSchema = z.object({
  system: DesignSystemSchema,
  components: z.array(ComponentNodeSchema).optional(),
});

export async function analyzeImage(apiKey: string, base64Image: string, prompt: string = SYSTEM_PROMPT, extractedColors?: string[]) {
  try {
    let userPromptText = 'Analyze this image according to the system prompt.';

    // Inject extracted colors if available (Hybrid Logic)
    if (extractedColors && extractedColors.length > 0) {
        userPromptText += `\n\n[Pre-Extracted Colors]: ${JSON.stringify(extractedColors)}\nUse these precise hex codes for the Primitives if relevant.`;
    }

    // Append M3 Spec to system prompt
    const fullSystemPrompt = prompt + "\n" + M3_SPEC_PROMPT_ADDENDUM;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: fullSystemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPromptText,
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image, // Data URL format: data:image/png;base64,...
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    const parsedJson = JSON.parse(content);

    // Validate with Zod
    const result = ResponseSchema.safeParse(parsedJson);

    if (!result.success) {
      console.error("AI Validation Error:", result.error);
      throw new Error("AI response did not match the required schema.");
    }

    return result.data;

  } catch (error) {
    console.error('Vision Service Error:', error);
    throw error;
  }
}
