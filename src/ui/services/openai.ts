import { SYSTEM_PROMPT, M3_SPEC_PROMPT_ADDENDUM } from '../../common/prompt';
import { DesignSystemSchema, ComponentNodeSchema } from '../../common/schema';
import { z } from 'zod';

// 유연한 응답 스키마 - 부분 응답도 처리 가능
const ResponseSchema = z.object({
  system: DesignSystemSchema.optional(),
  components: z.array(ComponentNodeSchema).optional(),
}).refine((data) => data.system || data.components, {
  message: "Either system or components must be present"
});

interface AnalyzeImageOptions {
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export async function analyzeImage(
  apiKey: string,
  base64Image: string | string[],
  prompt: string = SYSTEM_PROMPT,
  extractedColors?: string[],
  options: AnalyzeImageOptions = {}
) {
  const { maxTokens = 4000, temperature = 0.2, timeout = 60000 } = options;

  try {
    // API 키 유효성 검사
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('올바른 OpenAI API 키를 입력해주세요.');
    }

    let userPromptText = 'Analyze this image according to the system prompt.';

    // 추출된 색상 주입 (하이브리드 로직)
    if (extractedColors && extractedColors.length > 0) {
        userPromptText += `\n\n[Pre-Extracted Colors]: ${JSON.stringify(extractedColors)}\n이 정확한 hex 코드들을 Primitives에 사용하세요.`;
    }

    // M3 사양을 시스템 프롬프트에 추가
    const fullSystemPrompt = prompt + "\n" + M3_SPEC_PROMPT_ADDENDUM;

    // 사용자 콘텐츠 구성 (텍스트 + 이미지)
    const userContent: any[] = [
        { type: 'text', text: userPromptText }
    ];

    if (Array.isArray(base64Image)) {
        base64Image.forEach(img => {
            userContent.push({
                type: 'image_url',
                image_url: {
                  url: img,
                  detail: 'high' // 고해상도 분석
                }
            });
        });
    } else {
        userContent.push({
            type: 'image_url',
            image_url: {
              url: base64Image,
              detail: 'high'
            }
        });
    }

    // 타임아웃 처리를 위한 AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview', // 더 안정적인 모델
        messages: [
          {
            role: 'system',
            content: fullSystemPrompt,
          },
          {
            role: 'user',
            content: userContent,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: maxTokens,
        temperature: temperature,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `OpenAI API 오류: ${response.status}`;

      // 구체적인 에러 메시지 제공
      if (response.status === 401) {
        errorMessage = 'API 키가 올바르지 않습니다. 설정을 확인해주세요.';
      } else if (response.status === 429) {
        errorMessage = 'API 사용량 한도에 도달했습니다. 잠시 후 다시 시도해주세요.';
      } else if (response.status === 500) {
        errorMessage = 'OpenAI 서버 오류입니다. 잠시 후 다시 시도해주세요.';
      }

      throw new Error(`${errorMessage}\n세부사항: ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI로부터 응답을 받지 못했습니다.");
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON 파싱 실패:", content);
      throw new Error("AI 응답이 올바른 JSON 형식이 아닙니다.");
    }

    // Zod로 검증
    const result = ResponseSchema.safeParse(parsedJson);

    if (!result.success) {
      console.error("AI 검증 오류:", result.error);
      console.error("받은 데이터:", parsedJson);

      // 부분적으로라도 사용 가능한 데이터가 있는지 확인
      if (parsedJson.system || parsedJson.components) {
        console.warn("부분적으로 유효한 데이터를 반환합니다.");
        return parsedJson;
      }

      throw new Error("AI 응답이 필요한 스키마와 일치하지 않습니다.");
    }

    return result.data;

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 이미지 크기를 줄이거나 다시 시도해주세요.');
    }

    console.error('Vision 서비스 오류:', error);
    throw error;
  }
}

// 이미지 유효성 검사 함수
export function validateBase64Image(base64String: string): boolean {
  try {
    const regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    return regex.test(base64String);
  } catch {
    return false;
  }
}

// API 키 유효성 검사 함수
export function validateApiKey(apiKey: string): { valid: boolean; message?: string } {
  if (!apiKey) {
    return { valid: false, message: 'API 키를 입력해주세요.' };
  }

  if (!apiKey.startsWith('sk-')) {
    return { valid: false, message: 'OpenAI API 키는 "sk-"로 시작해야 합니다.' };
  }

  if (apiKey.length < 50) {
    return { valid: false, message: 'API 키가 너무 짧습니다. 올바른 키인지 확인해주세요.' };
  }

  return { valid: true };
}
