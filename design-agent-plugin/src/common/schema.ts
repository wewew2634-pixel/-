import { z } from 'zod';

// --- Primitives ---

export const ColorTokenSchema = z.object({
  name: z.string(),
  value: z.string(), // Hex
});

export const NumberTokenSchema = z.object({
  name: z.string(),
  value: z.number(), // Pixel value
});

export const TypographyTokenSchema = z.object({
  name: z.string(),
  fontFamily: z.string(),
  fontWeight: z.union([z.string(), z.number()]),
  fontSize: z.number(),
  lineHeight: z.union([z.string(), z.number()]).optional(),
  letterSpacing: z.union([z.string(), z.number()]).optional(),
});

// --- Semantics ---

export const SemanticColorSchema = z.object({
  name: z.string(), // e.g., "primary-bg"
  reference: z.string(), // Name of the primitive token, e.g., "blue-500"
});

// --- System Schema ---

export const DesignSystemSchema = z.object({
  primitives: z.object({
    colors: z.array(ColorTokenSchema),
    spacing: z.array(NumberTokenSchema),
    radius: z.array(NumberTokenSchema),
  }),
  semantics: z.object({
    colors: z.array(SemanticColorSchema),
  }),
  typography: z.array(TypographyTokenSchema),
});

export type DesignSystem = z.infer<typeof DesignSystemSchema>;

// --- Messages ---

export const PluginMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('GENERATE_SYSTEM'),
    payload: DesignSystemSchema,
  }),
  z.object({
    type: z.literal('NOTIFY'),
    message: z.string(),
  }),
]);

export type PluginMessage = z.infer<typeof PluginMessageSchema>;
