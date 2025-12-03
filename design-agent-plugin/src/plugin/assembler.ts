import type { ComponentNode, FrameNode as FrameSchema, TextNode as TextSchema, ComponentSetNode as ComponentSetSchema } from '../common/schema';

// Map structure to hold references to created/existing variables
export type VariableMap = Map<string, Variable>;
export type StyleMap = Map<string, TextStyle>;

export async function createComponent(
  nodeData: ComponentNode,
  variableMap: VariableMap,
  styleMap: StyleMap
): Promise<SceneNode | ComponentSetNode> {
  if (nodeData.type === 'FRAME') {
    return createFrameNode(nodeData, variableMap, styleMap);
  } else if (nodeData.type === 'TEXT') {
    return createTextNode(nodeData, variableMap, styleMap);
  } else if (nodeData.type === 'COMPONENT_SET') {
    return createComponentSetNode(nodeData, variableMap, styleMap);
  }
  throw new Error(`Unknown node type: ${(nodeData as any).type}`);
}

async function createComponentSetNode(
  data: ComponentSetSchema,
  variableMap: VariableMap,
  styleMap: StyleMap
): Promise<ComponentSetNode> {
  const variants: FrameNode[] = [];

  // 1. Create all variant frames
  for (const variant of data.variants) {
    const frame = await createFrameNode(variant.structure, variableMap, styleMap);

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
  styleMap: StyleMap
): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = data.name;

  // 1. Auto Layout Setup
  frame.layoutMode = data.layoutMode;

  // V2 Sizing Logic: HUG vs FILL
  if (data.sizing) {
    // Horizontal
    if (data.sizing.horizontal === 'FIXED') {
      frame.primaryAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'FIXED' : frame.primaryAxisSizingMode;
      frame.counterAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'FIXED' : frame.counterAxisSizingMode;
      frame.layoutSizingHorizontal = 'FIXED';
      if (data.width) frame.resize(data.width, frame.height);
    } else if (data.sizing.horizontal === 'HUG') {
      frame.primaryAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'AUTO' : frame.primaryAxisSizingMode;
      frame.counterAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'AUTO' : frame.counterAxisSizingMode;
      frame.layoutSizingHorizontal = 'HUG';
    } else if (data.sizing.horizontal === 'FILL') {
      frame.layoutSizingHorizontal = 'FILL';
    }

    // Vertical
    if (data.sizing.vertical === 'FIXED') {
      frame.primaryAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'FIXED' : frame.primaryAxisSizingMode;
      frame.counterAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'FIXED' : frame.counterAxisSizingMode;
      frame.layoutSizingVertical = 'FIXED';
      if (data.height) frame.resize(frame.width, data.height);
    } else if (data.sizing.vertical === 'HUG') {
       frame.primaryAxisSizingMode = data.layoutMode === 'VERTICAL' ? 'AUTO' : frame.primaryAxisSizingMode;
       frame.counterAxisSizingMode = data.layoutMode === 'HORIZONTAL' ? 'AUTO' : frame.counterAxisSizingMode;
       frame.layoutSizingVertical = 'HUG';
    } else if (data.sizing.vertical === 'FILL') {
      frame.layoutSizingVertical = 'FILL';
    }

  } else {
    // Fallback to V1 logic
    if (data.primaryAxisSizingMode) frame.primaryAxisSizingMode = data.primaryAxisSizingMode;
    if (data.counterAxisSizingMode) frame.counterAxisSizingMode = data.counterAxisSizingMode;

    // Sizing (only if FIXED)
    if (data.primaryAxisSizingMode === 'FIXED' && data.width) frame.resize(data.width, frame.height);
    if (data.counterAxisSizingMode === 'FIXED' && data.height) frame.resize(frame.width, data.height);
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


  // 5. Recursion (Children)
  for (const childData of data.children) {
    const childNode = await createComponent(childData, variableMap, styleMap);
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
