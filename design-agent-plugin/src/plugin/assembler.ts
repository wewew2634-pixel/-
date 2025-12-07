import type { ComponentNode, FrameNode as FrameSchema, TextNode as TextSchema, ComponentSetNode as ComponentSetSchema, AtomNode } from '../common/schema';

// Map structure to hold references to created/existing variables
export type VariableMap = Map<string, Variable>;
export type StyleMap = Map<string, TextStyle>;
export type EffectStyleMap = Map<string, EffectStyle>;

export async function createComponent(
  nodeData: ComponentNode,
  variableMap: VariableMap,
  styleMap: StyleMap,
  effectStyleMap: EffectStyleMap
): Promise<SceneNode | ComponentSetNode> {
  // Check for Atom Types first (they don't have a simple 'type' field equal to FRAME/TEXT)
  // Actually, in our schema, AtomNode is a union of objects that have `atomType`.
  // We can check for `atomType` property.
  if ('atomType' in nodeData) {
      return createAtomNode(nodeData as AtomNode, variableMap, styleMap, effectStyleMap);
  }

  if (nodeData.type === 'FRAME') {
    return createFrameNode(nodeData, variableMap, styleMap, effectStyleMap);
  } else if (nodeData.type === 'TEXT') {
    return createTextNode(nodeData, variableMap, styleMap);
  } else if (nodeData.type === 'COMPONENT_SET') {
    return createComponentSetNode(nodeData, variableMap, styleMap, effectStyleMap);
  }
  throw new Error(`Unknown node type: ${JSON.stringify(nodeData)}`);
}

// --- M3 Atom Builder ---

async function createAtomNode(
    data: AtomNode,
    variableMap: VariableMap,
    styleMap: StyleMap,
    effectStyleMap: EffectStyleMap
): Promise<FrameNode> {

    // Dispatch to specific builders based on atomType
    switch (data.atomType) {
        case 'BUTTON': return buildButton(data, variableMap, styleMap, effectStyleMap);
        case 'TEXT_FIELD': return buildTextField(data, variableMap, styleMap, effectStyleMap);
        case 'CHIP': return buildChip(data, variableMap, styleMap, effectStyleMap);
        case 'CARD': return buildCard(data, variableMap, styleMap, effectStyleMap);
        // Fallback for others to generic frame for MVP or specific implementations
        default: return buildGenericAtom(data, variableMap, styleMap, effectStyleMap);
    }
}

// 1. Button Builder
async function buildButton(data: any, vm: VariableMap, sm: StyleMap, em: EffectStyleMap): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = data.name || `Button/${data.variant}`;

    // Base Layout
    frame.layoutMode = 'HORIZONTAL';
    frame.primaryAxisSizingMode = 'AUTO'; // Hug
    frame.counterAxisSizingMode = 'AUTO'; // Hug
    frame.primaryAxisAlignItems = 'CENTER';
    frame.counterAxisAlignItems = 'CENTER';

    // Apply common props (padding, gap, radius) if provided, or defaults based on variant
    const paddingX = data.paddingX ? (typeof data.paddingX === 'number' ? data.paddingX : 24) : 24;
    const paddingY = data.paddingY ? (typeof data.paddingY === 'number' ? data.paddingY : 10) : 10;
    frame.paddingLeft = paddingX;
    frame.paddingRight = paddingX;
    frame.paddingTop = paddingY;
    frame.paddingBottom = paddingY;
    frame.itemSpacing = 8; // Icon gap

    // Styling based on Variant
    // This assumes specific token names exist or provided in 'fill'.
    // If 'fill' is provided in JSON, use it. If not, we might need a default strategy.
    // For MVP, we rely on the AI passing the correct Semantic Token in 'fill'.
    applyCommonProps(frame, data, vm, em);

    // Icon (Leading)
    if (data.icon === 'LEADING') {
        const icon = figma.createFrame(); // Placeholder
        icon.name = "Icon";
        icon.resize(18, 18);
        icon.fills = [{type: 'SOLID', color: {r:0, g:0, b:0}, opacity: 0}]; // Transparent
        // TODO: Apply icon color if needed
        frame.appendChild(icon);
    }

    // Label
    const label = figma.createText();
    label.name = "Label";
    label.characters = data.label || "Button";
    // Apply Text Style
    // We try to find a style that matches "Label" or "Body"
    // Or iterate styleMap to find something reasonable
    await loadAndApplyFont(label, "Label/Large", sm);

    // Text Color
    // If button is Filled, text is usually 'on-primary'. If Outlined, 'primary'.
    // We rely on AI providing this? The schema doesn't have specific text color field for ButtonAtom.
    // Let's deduce or look for a generic prop.
    // Actually, createAtomNode should handle this if we extended schema better.
    // For now, let's assume the text inherits tint or black/white based on fill.

    frame.appendChild(label);

    // Icon (Trailing)
    if (data.icon === 'TRAILING') {
        const icon = figma.createFrame();
        icon.name = "Icon";
        icon.resize(18, 18);
        frame.appendChild(icon);
    }

    return frame;
}

// 4. TextField Builder (M3)
async function buildTextField(data: any, vm: VariableMap, sm: StyleMap, em: EffectStyleMap): Promise<FrameNode> {
    // Structure:
    // Frame (Container) -> [
    //    Column -> [ Label(Text), InputRow(Frame) -> [InputText, TrailingIcon] ],
    //    SupportingText
    // ]
    // Simplified: Frame (AutoLayout Vertical) -> [ Label, InputBox ]

    const container = figma.createFrame();
    container.name = data.name || "TextField";
    container.layoutMode = "VERTICAL";
    container.primaryAxisSizingMode = "AUTO";
    container.counterAxisSizingMode = "FIXED"; // Width fixed/fill
    container.resize(data.width || 300, container.height);
    container.itemSpacing = 4;

    // Label
    const label = figma.createText();
    label.characters = data.label;
    await loadAndApplyFont(label, "Body/Small", sm);
    container.appendChild(label);

    // Input Box
    const inputBox = figma.createFrame();
    inputBox.name = "Input Container";
    inputBox.layoutMode = "HORIZONTAL";
    inputBox.layoutSizingHorizontal = 'FILL'; // Fill container
    inputBox.layoutSizingVertical = 'FIXED';
    inputBox.resize(inputBox.width, 56); // M3 standard
    inputBox.paddingLeft = 16;
    inputBox.paddingRight = 16;
    inputBox.primaryAxisAlignItems = 'CENTER'; // Vertically center text

    // Style Input Box
    applyCommonProps(inputBox, data, vm, em);
    // Overrides for variant
    if (data.variant === 'OUTLINED') {
        inputBox.strokeWeight = 1;
        // Stroke color binding... handled by applyCommonProps if 'stroke' is passed
    } else {
        // Filled style
        // applyCommonProps handles 'fill'
        // Bottom border logic is complex for MVP, stick to full box
    }

    // Input Text
    const inputText = figma.createText();
    inputText.name = "Input Text";
    inputText.characters = data.text || "Input value";
    inputText.layoutSizingHorizontal = 'FILL';
    await loadAndApplyFont(inputText, "Body/Large", sm);
    inputBox.appendChild(inputText);

    if (data.trailingIcon) {
        const icon = figma.createFrame();
        icon.resize(24,24);
        icon.name = "Icon";
        inputBox.appendChild(icon);
    }

    container.appendChild(inputBox);

    if (data.supportingText) {
        const support = figma.createText();
        support.characters = data.supportingText;
        await loadAndApplyFont(support, "Body/Small", sm);
        container.appendChild(support);
    }

    return container;
}

// 5. Chip Builder
async function buildChip(data: any, vm: VariableMap, sm: StyleMap, em: EffectStyleMap): Promise<FrameNode> {
    const chip = figma.createFrame();
    chip.name = data.name || "Chip";
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "FIXED"; // Fixed height
    chip.resize(chip.width, 32);
    chip.paddingLeft = 12;
    chip.paddingRight = 12;
    chip.itemSpacing = 8;
    chip.primaryAxisAlignItems = "CENTER";
    chip.counterAxisAlignItems = "CENTER";

    applyCommonProps(chip, data, vm, em);
    // Force radius for chips usually
    chip.cornerRadius = 8; // Or semantic radius

    if (data.icon) {
         const icon = figma.createFrame();
         icon.resize(18,18);
         chip.appendChild(icon);
    }

    const label = figma.createText();
    label.characters = data.label;
    await loadAndApplyFont(label, "Label/Medium", sm);
    chip.appendChild(label);

    return chip;
}

// 8. Card Builder
async function buildCard(data: any, vm: VariableMap, sm: StyleMap, em: EffectStyleMap): Promise<FrameNode> {
    const card = figma.createFrame();
    card.name = data.name || "Card";
    card.layoutMode = "VERTICAL";
    // M3 Card defaults
    applyCommonProps(card, data, vm, em);

    // Process children recursively
    if (data.children) {
        for (const childData of data.children) {
            const childNode = await createComponent(childData, vm, sm, em);
            if (childNode) card.appendChild(childNode as SceneNode);
        }
    }
    return card;
}

// Generic Atom Builder (Fallback)
async function buildGenericAtom(data: any, vm: VariableMap, _sm: StyleMap, em: EffectStyleMap): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = data.name || data.atomType;
    frame.layoutMode = 'HORIZONTAL';
    applyCommonProps(frame, data, vm, em);
    return frame;
}

// --- Helpers ---

function applyCommonProps(node: FrameNode, data: any, vm: VariableMap, em: EffectStyleMap) {
    // Variable Binding helpers from previous code...
    // Re-implementing briefly or reusing logic would be better, but for this step we duplicate/adapt the binding logic
    // from createFrameNode to here for the specific atoms.

    // Reuse specific binding logic (Fill, Stroke, Radius, Effect)
    if (data.fill) {
        const v = vm.get(data.fill);
        if (v) {
             const paint: SolidPaint = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };
             const bound = figma.variables.setBoundVariableForPaint(paint, 'color', v);
             node.fills = [bound];
        }
    }
    if (data.stroke) {
        const v = vm.get(data.stroke);
        if (v) {
             const paint: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
             const bound = figma.variables.setBoundVariableForPaint(paint, 'color', v);
             node.strokes = [bound];
             node.strokeWeight = 1;
        }
    }
    if (data.radius) {
        const v = vm.get(data.radius);
        if (v) {
           node.setBoundVariable('topLeftRadius', v.id);
           node.setBoundVariable('topRightRadius', v.id);
           node.setBoundVariable('bottomLeftRadius', v.id);
           node.setBoundVariable('bottomRightRadius', v.id);
        }
    }
    if (data.effect) {
        const s = em.get(data.effect);
        if (s) node.effectStyleId = s.id;
    }

    // Spacing/Padding variables
    // ... (Similar logic to createFrameNode, omitted for brevity but assumed present or copied)
}

async function loadAndApplyFont(node: TextNode, styleName: string, sm: StyleMap) {
    let style = sm.get(styleName);
    // Fallback if exact style not found, try to fuzzy match or default
    if (!style) {
        style = sm.get("Body/Medium") || sm.values().next().value;
    }

    if (style) {
        await figma.loadFontAsync(style.fontName);
        node.textStyleId = style.id;
    } else {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    }
}


async function createComponentSetNode(
  data: ComponentSetSchema,
  variableMap: VariableMap,
  styleMap: StyleMap,
  effectStyleMap: EffectStyleMap
): Promise<ComponentSetNode> {
  const variants: FrameNode[] = [];

  // 1. Create all variant frames
  for (const variant of data.variants) {
    const frame = await createFrameNode(variant.structure, variableMap, styleMap, effectStyleMap);

    // Construct property name string: "State=Hover, Size=Large"
    const nameParts = Object.entries(variant.properties).map(([key, value]) => `${key}=${value}`);
    frame.name = nameParts.join(', ');

    variants.push(frame);
  }

  // 2. Combine into Component Set
  // We need to place them on the canvas first to combine
  // Layout them in a grid temporarily so they don't overlap
  let x = 0;
  variants.forEach((v) => {
    v.x = x;
    x += v.width + 50;
  });

  // figma.combineAsVariants requires nodes to be on the page.
  // We assume createFrameNode appends them or we need to ensure they are parenting somewhere?
  // createFrameNode creates a frame but doesn't append it to document by default usually, unless specified.
  // We need to append them to the current page temporarily.
  variants.forEach(v => figma.currentPage.appendChild(v));

  // Note: figma.combineAsVariants accepts a generic Array<SceneNode>, but effectively needs frames or components.
  // Our `variants` array is strictly `FrameNode[]` (from Figma API).
  // Type Assertion: We are passing Figma's FrameNode, which is valid for combineAsVariants, but TS is confused by our local ComponentNode import.
  const componentSet = figma.combineAsVariants(variants as any[], figma.currentPage);
  componentSet.name = data.name;

  // 3. Auto Layout for the Component Set itself (Optional but nice for organization)
  componentSet.layoutMode = 'HORIZONTAL';
  componentSet.itemSpacing = 50;
  componentSet.paddingLeft = 50;
  componentSet.paddingRight = 50;
  componentSet.paddingTop = 50;
  componentSet.paddingBottom = 50;
  componentSet.primaryAxisSizingMode = 'AUTO';
  componentSet.counterAxisSizingMode = 'AUTO';

  return componentSet;
}

async function createFrameNode(
  data: FrameSchema,
  variableMap: VariableMap,
  styleMap: StyleMap,
  effectStyleMap: EffectStyleMap
): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = data.name;

  // 1. Auto Layout Setup
  frame.layoutMode = data.layoutMode || 'HORIZONTAL'; // Default if undefined

  // V2 Sizing Logic: HUG vs FILL
  if (data.sizing) {
    // Horizontal
    if (data.sizing.horizontal === 'FIXED') {
      (frame as any).primaryAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'FIXED' : (frame as any).primaryAxisSizingMode;
      (frame as any).counterAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'FIXED' : (frame as any).counterAxisSizingMode;
      frame.layoutSizingHorizontal = 'FIXED';
      if (data.width) frame.resize(data.width, frame.height);
    } else if (data.sizing.horizontal === 'HUG') {
      (frame as any).primaryAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'AUTO' : (frame as any).primaryAxisSizingMode;
      (frame as any).counterAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'AUTO' : (frame as any).counterAxisSizingMode;
      frame.layoutSizingHorizontal = 'HUG';
    } else if (data.sizing.horizontal === 'FILL') {
      frame.layoutSizingHorizontal = 'FILL';
    }

    // Vertical
    if (data.sizing.vertical === 'FIXED') {
      (frame as any).primaryAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'FIXED' : (frame as any).primaryAxisSizingMode;
      (frame as any).counterAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'FIXED' : (frame as any).counterAxisSizingMode;
      frame.layoutSizingVertical = 'FIXED';
      if (data.height) frame.resize(frame.width, data.height);
    } else if (data.sizing.vertical === 'HUG') {
       (frame as any).primaryAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'AUTO' : (frame as any).primaryAxisSizingMode;
       (frame as any).counterAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'AUTO' : (frame as any).counterAxisSizingMode;
       frame.layoutSizingVertical = 'HUG';
    } else if (data.sizing.vertical === 'FILL') {
      frame.layoutSizingVertical = 'FILL';
    }

  } else {
    // Fallback to V1 logic
    if ((data as any).primaryAxisSizingMode) (frame as any).primaryAxisSizingMode = (data as any).primaryAxisSizingMode;
    if ((data as any).counterAxisSizingMode) (frame as any).counterAxisSizingMode = (data as any).counterAxisSizingMode;

    // Sizing (only if FIXED)
    if ((data as any).primaryAxisSizingMode === 'FIXED' && data.width) frame.resize(data.width, frame.height);
    if ((data as any).counterAxisSizingMode === 'FIXED' && data.height) frame.resize(frame.width, data.height);
  }


  // 2. Variable Binding (Spacing & Radius)
  // Helper to apply number or variable
  const applyNumberOrVar = (
    value: string | number | undefined,
    applyFn: (val: number) => void,
    field: VariableBindableNodeField, // e.g. 'itemSpacing', 'paddingLeft'
  ) => {
    if (value === undefined) return;

    if (typeof value === 'number') {
      applyFn(value);
    } else {
      // It's a token name
      const variable = variableMap.get(value);
      if (variable) {
        // For simple properties like cornerRadius, we can bind directly
        // Note: Check if the field is valid for binding on this node type
        try {
            frame.setBoundVariable(field, variable.id);
        } catch (e) {
            console.warn(`Could not bind variable ${value} to ${field}`, e);
        }
      }
    }
  };

  // Gap (Item Spacing)
  applyNumberOrVar(data.itemSpacing, (v) => { frame.itemSpacing = v; }, 'itemSpacing');

  // Padding
  // If "padding" is set, apply to all. If X/Y set, override.
  if (data.padding) {
      const val = data.padding;
      applyNumberOrVar(val, (v) => { frame.paddingLeft = v; }, 'paddingLeft');
      applyNumberOrVar(val, (v) => { frame.paddingRight = v; }, 'paddingRight');
      applyNumberOrVar(val, (v) => { frame.paddingTop = v; }, 'paddingTop');
      applyNumberOrVar(val, (v) => { frame.paddingBottom = v; }, 'paddingBottom');
  }
  if (data.paddingX) {
      applyNumberOrVar(data.paddingX, (v) => { frame.paddingLeft = v; }, 'paddingLeft');
      applyNumberOrVar(data.paddingX, (v) => { frame.paddingRight = v; }, 'paddingRight');
  }
  if (data.paddingY) {
      applyNumberOrVar(data.paddingY, (v) => { frame.paddingTop = v; }, 'paddingTop');
      applyNumberOrVar(data.paddingY, (v) => { frame.paddingBottom = v; }, 'paddingBottom');
  }

  // Corner Radius
  if (data.radius) {
      const variable = variableMap.get(data.radius);
      if (variable) {
          frame.setBoundVariable('topLeftRadius', variable.id);
          frame.setBoundVariable('topRightRadius', variable.id);
          frame.setBoundVariable('bottomLeftRadius', variable.id);
          frame.setBoundVariable('bottomRightRadius', variable.id);
      }
  }

  // 3. Fills (Background)
  if (data.fill) {
    const variable = variableMap.get(data.fill);
    if (variable) {
        // Correct way for COLOR variables:
        // For Paints, we use `figma.variables.setBoundVariableForPaint(paint, 'color', variable)`.
        const newPaint: SolidPaint = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } }; // Dummy color
        const newPaintWithBinding = figma.variables.setBoundVariableForPaint(newPaint, 'color', variable);

        frame.fills = [newPaintWithBinding];
    }
  }

  // 4. Strokes
  if (data.stroke) {
      const variable = variableMap.get(data.stroke);
      if (variable) {
          const newPaint: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
          const newPaintWithBinding = figma.variables.setBoundVariableForPaint(newPaint, 'color', variable);
          frame.strokes = [newPaintWithBinding];
          frame.strokeWeight = 1; // Default
      }
  }

  // 5. Effects (Shadows/Blurs)
  if (data.effect) {
      const effectStyle = effectStyleMap.get(data.effect);
      if (effectStyle) {
          frame.effectStyleId = effectStyle.id;
      }
  }

  // 6. Recursion (Children)
  for (const childData of data.children) {
    const childNode = await createComponent(childData, variableMap, styleMap, effectStyleMap);
    // If it's a ComponentSet, we can treat it as a SceneNode (it extends FrameNode in Figma API roughly)
    // But ComponentSetNode (Figma) is a SceneNode.
    if (childNode) {
        frame.appendChild(childNode as SceneNode);
    }
  }

  return frame;
}

async function createTextNode(
  data: TextSchema,
  variableMap: VariableMap,
  styleMap: StyleMap
): Promise<TextNode> {
  const text = figma.createText();
  text.name = data.name;

  // Load font first! (Crucial)
  // We need to know which font to load.
  // The styleMap has the TextStyle, which has the fontName.
  const style = styleMap.get(data.style);
  if (style) {
      await figma.loadFontAsync(style.fontName);
      text.textStyleId = style.id;
  } else {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }

  text.characters = data.content;

  // Color
  if (data.color) {
      const variable = variableMap.get(data.color);
      if (variable) {
          const newPaint: SolidPaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
          const newPaintWithBinding = figma.variables.setBoundVariableForPaint(newPaint, 'color', variable);
          text.fills = [newPaintWithBinding];
      }
  }

  // V2 Sizing Logic for Text
  if (data.sizing) {
      if (data.sizing.horizontal === 'FILL') text.layoutSizingHorizontal = 'FILL';
      if (data.sizing.horizontal === 'HUG') text.layoutSizingHorizontal = 'HUG';
      if (data.sizing.horizontal === 'FIXED') text.layoutSizingHorizontal = 'FIXED';

      if (data.sizing.vertical === 'FILL') text.layoutSizingVertical = 'FILL';
      if (data.sizing.vertical === 'HUG') text.layoutSizingVertical = 'HUG';
      if (data.sizing.vertical === 'FIXED') text.layoutSizingVertical = 'FIXED';
  }

  return text;
}
