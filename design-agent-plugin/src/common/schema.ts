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

// --- Component Schema (Recursive) ---

// Base properties shared by all nodes
const BaseNodeSchema = z.object({
  name: z.string(),
});

// Text Node
export const TextNodeSchema = BaseNodeSchema.extend({
  type: z.literal('TEXT'),
  content: z.string(),
  style: z.string(), // Reference to TypographyToken name
  color: z.string().optional(), // Reference to ColorToken name

  // Sizing Rules for Text
  sizing: z.object({
      horizontal: z.enum(['FIXED', 'HUG', 'FILL']),
      vertical: z.enum(['FIXED', 'HUG', 'FILL']),
  }).optional(),
});

export type TextNode = z.infer<typeof TextNodeSchema>;

// Frame Node (Auto Layout)
// We need to define this lazily because it's recursive
export const FrameNodeSchema: z.ZodType<any> = BaseNodeSchema.extend({
  type: z.literal('FRAME'),
  layoutMode: z.enum(['HORIZONTAL', 'VERTICAL']),

  // Sizing Rules (Replaces primaryAxisSizingMode/counterAxisSizingMode for V2)
  sizing: z.object({
      horizontal: z.enum(['FIXED', 'HUG', 'FILL']),
      vertical: z.enum(['FIXED', 'HUG', 'FILL']),
  }).optional(),

  // Legacy sizing (Keep for backward compatibility or direct mapping if needed)
  primaryAxisSizingMode: z.enum(['FIXED', 'AUTO']).optional(),
  counterAxisSizingMode: z.enum(['FIXED', 'AUTO']).optional(),

  width: z.number().optional(), // For FIXED
  height: z.number().optional(), // For FIXED

  // Styling (References to Tokens)
  fill: z.string().optional(), // Color token name
  stroke: z.string().optional(), // Color token name
  radius: z.string().optional(), // Radius token name

  // Spacing (References to Tokens or raw numbers)
  itemSpacing: z.union([z.string(), z.number()]).optional(),
  padding: z.union([z.string(), z.number()]).optional(), // Simple padding for now (all sides)
  paddingX: z.union([z.string(), z.number()]).optional(),
  paddingY: z.union([z.string(), z.number()]).optional(),

  children: z.lazy(() => z.array(ComponentNodeSchema)),
});

export type FrameNode = {
  name: string;
  type: 'FRAME';
  layoutMode: 'HORIZONTAL' | 'VERTICAL';
  sizing?: {
      horizontal: 'FIXED' | 'HUG' | 'FILL';
      vertical: 'FIXED' | 'HUG' | 'FILL';
  };
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  radius?: string;
  itemSpacing?: string | number;
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  children: ComponentNode[];
};

// Component Variant Schema
export const VariantNodeSchema = z.object({
    type: z.literal('VARIANT'),
    properties: z.record(z.string()), // e.g. { "State": "Hover", "Size": "Large" }
    structure: FrameNodeSchema, // The actual design of this variant
});

export type VariantNode = z.infer<typeof VariantNodeSchema>;

export const ComponentSetNodeSchema = z.object({
    type: z.literal('COMPONENT_SET'),
    name: z.string(), // e.g. "Button"
    variants: z.array(VariantNodeSchema),
});

export type ComponentSetNode = z.infer<typeof ComponentSetNodeSchema>;

// Unified Component Node
export const ComponentNodeSchema = z.union([
    TextNodeSchema,
    FrameNodeSchema,
    ComponentSetNodeSchema
]);

export type ComponentNode = TextNode | FrameNode | ComponentSetNode;

// --- Messages ---

export const PluginMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('GENERATE_SYSTEM'),
    payload: z.object({
      system: DesignSystemSchema,
      components: z.array(ComponentNodeSchema).optional(),
    }),
  }),
  z.object({
    type: z.literal('GENERATE_SYSTEM_ONLY'),
    payload: z.object({
      system: DesignSystemSchema,
    }),
  }),
  z.object({
    type: z.literal('GENERATE_COMPONENT_ONLY'),
    payload: z.object({
      components: z.array(ComponentNodeSchema),
    }),
  }),
  z.object({
    type: z.literal('SAVE_API_KEY'),
    apiKey: z.string(),
  }),
  z.object({
    type: z.literal('LOAD_API_KEY'),
  }),
  z.object({
    type: z.literal('API_KEY_LOADED'),
    apiKey: z.string().optional(),
  }),
  z.object({
    type: z.literal('NOTIFY'),
    message: z.string(),
  }),
]);

export type PluginMessage = z.infer<typeof PluginMessageSchema>;
