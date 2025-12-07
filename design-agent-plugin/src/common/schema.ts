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

// --- Effects ---

export const EffectTokenSchema = z.object({
  name: z.string(),
  type: z.enum(["DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR"]),
  value: z.object({
    x: z.number().optional(), // For Shadows
    y: z.number().optional(), // For Shadows
    blur: z.number(),
    spread: z.number().optional(), // For Shadows
    color: z.string().optional(), // Hex color for shadows
    opacity: z.number().optional(), // 0-1 for shadow color opacity
    radius: z.number().optional(), // For Blur
  }),
});

// --- Semantics ---

export const SemanticColorSchema = z.object({
  name: z.string(),
  reference: z.string(),
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
  effects: z.array(EffectTokenSchema).optional(),
});

export type DesignSystem = z.infer<typeof DesignSystemSchema>;

// --- M3 Atom Types ---

// Define specific schemas for M3 Atoms to give AI structured targets
// These extend the base properties but enforce specific types/variants

const BaseAtomSchema = z.object({
    name: z.string(),
    // Standard Frame props
    layoutMode: z.enum(['HORIZONTAL', 'VERTICAL']).optional(), // Optional because assembler might auto-set based on type
    sizing: z.object({
        horizontal: z.enum(['FIXED', 'HUG', 'FILL']),
        vertical: z.enum(['FIXED', 'HUG', 'FILL']),
    }).optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    padding: z.union([z.string(), z.number()]).optional(),
    paddingX: z.union([z.string(), z.number()]).optional(),
    paddingY: z.union([z.string(), z.number()]).optional(),
    itemSpacing: z.union([z.string(), z.number()]).optional(),
    fill: z.string().optional(),
    stroke: z.string().optional(),
    radius: z.string().optional(),
    effect: z.string().optional(),
});

// 1. Button
export const ButtonAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('BUTTON'),
    variant: z.enum(['FILLED', 'TONAL', 'OUTLINED', 'TEXT', 'ELEVATED']),
    icon: z.enum(['NONE', 'LEADING', 'TRAILING']).optional(),
    label: z.string(),
});

// 2. FAB
export const FabAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('FAB'),
    size: z.enum(['SMALL', 'REGULAR', 'LARGE', 'EXTENDED']),
    icon: z.string().optional(), // Icon name placeholder
    label: z.string().optional(), // Only for Extended
});

// 3. IconButton
export const IconButtonAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('ICON_BUTTON'),
    variant: z.enum(['STANDARD', 'FILLED', 'TONAL', 'OUTLINED']),
    icon: z.string(),
});

// 4. TextField
export const TextFieldAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('TEXT_FIELD'),
    variant: z.enum(['FILLED', 'OUTLINED']),
    label: z.string(),
    text: z.string().optional(),
    supportingText: z.string().optional(),
    leadingIcon: z.string().optional(),
    trailingIcon: z.string().optional(),
});

// 5. Chip
export const ChipAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('CHIP'),
    variant: z.enum(['ASSIST', 'FILTER', 'INPUT', 'SUGGESTION']),
    label: z.string(),
    selected: z.boolean().optional(),
    icon: z.string().optional(),
});

// 6. Switch
export const SwitchAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('SWITCH'),
    selected: z.boolean(),
    withIcon: z.boolean().optional(),
});

// 7. Checkbox
export const CheckboxAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('CHECKBOX'),
    state: z.enum(['UNCHECKED', 'CHECKED', 'INDETERMINATE']),
});

// Forward declaration for recursive types
export type ComponentNode = TextNode | FrameNode | ComponentSetNode | AtomNode;

// 8. Card
export const CardAtomSchema: z.ZodType<any> = BaseAtomSchema.extend({
    atomType: z.literal('CARD'),
    variant: z.enum(['ELEVATED', 'FILLED', 'OUTLINED']),
    // Cards are containers, so they have children
    children: z.lazy(() => z.array(ComponentNodeSchema)),
});

// 9. Badge
export const BadgeAtomSchema = BaseAtomSchema.extend({
    atomType: z.literal('BADGE'),
    size: z.enum(['SMALL', 'LARGE']),
    value: z.string().optional(), // For Large
});

// Union of all Atom types
export const AtomNodeSchema = z.union([
    ButtonAtomSchema,
    FabAtomSchema,
    IconButtonAtomSchema,
    TextFieldAtomSchema,
    ChipAtomSchema,
    SwitchAtomSchema,
    CheckboxAtomSchema,
    CardAtomSchema,
    BadgeAtomSchema
]);

export type AtomNode = z.infer<typeof AtomNodeSchema>;

// --- Generic Components ---

// Text Node
export const TextNodeSchema = z.object({
  name: z.string(),
  type: z.literal('TEXT'),
  content: z.string(),
  style: z.string(),
  color: z.string().optional(),
  sizing: z.object({
      horizontal: z.enum(['FIXED', 'HUG', 'FILL']),
      vertical: z.enum(['FIXED', 'HUG', 'FILL']),
  }).optional(),
});

export type TextNode = z.infer<typeof TextNodeSchema>;

// Frame Node (Generic Container)
export const FrameNodeSchema: z.ZodType<any> = BaseAtomSchema.extend({
  type: z.literal('FRAME'),
  children: z.lazy(() => z.array(ComponentNodeSchema)),
});

export type FrameNode = z.infer<typeof BaseAtomSchema> & {
  type: 'FRAME';
  children: ComponentNode[];
};

// Component Variant Schema
export const VariantNodeSchema = z.object({
    type: z.literal('VARIANT'),
    properties: z.record(z.string()),
    structure: z.union([FrameNodeSchema, AtomNodeSchema]), // Can be a generic Frame OR a specific Atom
});

export type VariantNode = z.infer<typeof VariantNodeSchema>;

export const ComponentSetNodeSchema = z.object({
    type: z.literal('COMPONENT_SET'),
    name: z.string(),
    variants: z.array(VariantNodeSchema),
});

export type ComponentSetNode = z.infer<typeof ComponentSetNodeSchema>;

// Unified Component Node
export const ComponentNodeSchema: z.ZodType<ComponentNode> = z.union([
    TextNodeSchema,
    FrameNodeSchema,
    ComponentSetNodeSchema,
    AtomNodeSchema // Add Atoms here
]);

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
