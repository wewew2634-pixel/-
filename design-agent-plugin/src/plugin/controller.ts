// This file holds the main code for the plugins. It runs in the same sandbox as a browser script
// but doesn't have access to the DOM or other browser APIs.

// This file is compiled via a separate build step (esbuild or vite lib mode)
// For now, we assume it will be built to dist/code.js

console.log('Plugin backend running');

figma.showUI(__html__, { width: 400, height: 600 });

import { PluginMessageSchema } from '../common/schema';
import type { DesignSystem, ComponentNode } from '../common/schema';
import { createComponent } from './assembler';
import type { VariableMap, StyleMap } from './assembler';

figma.ui.onmessage = async (msg) => {
  // Validate message
  const result = PluginMessageSchema.safeParse(msg);
  if (!result.success) {
    console.error('Invalid message format:', result.error);
    figma.notify('Error: Invalid message format');
    return;
  }

  const validatedMsg = result.data;

  if (validatedMsg.type === 'GENERATE_SYSTEM') {
    const { system, components } = validatedMsg.payload;
    const { variableMap, styleMap } = await generateSystem(system);

    if (components && components.length > 0) {
      await generateComponents(components, variableMap, styleMap);
    }

    figma.notify('Design System & Components Generated!');
  }

  if (validatedMsg.type === 'SAVE_API_KEY') {
    await figma.clientStorage.setAsync('openai_api_key', validatedMsg.apiKey);
    figma.notify('API Key Saved');
  }

  if (validatedMsg.type === 'LOAD_API_KEY') {
    const apiKey = await figma.clientStorage.getAsync('openai_api_key');
    figma.ui.postMessage({ type: 'API_KEY_LOADED', apiKey });
  }
};

async function generateSystem(system: DesignSystem): Promise<{ variableMap: VariableMap, styleMap: StyleMap }> {
  // 1. Create/Find Variable Collections
  const primitiveCollection = await getOrCreateCollection('Primitives');
  const tokenCollection = await getOrCreateCollection('Tokens');

  // Map to store ALL generated variables (primitives + semantics) for easy lookup by name
  const variableMap = new Map<string, Variable>();
  const styleMap = new Map<string, TextStyle>();

  // 2. Create Primitives (Variables)
  const primitiveMap = new Map<string, Variable>(); // Name -> Variable

  for (const color of system.primitives.colors) {
    const variable = await getOrCreateVariable(
      primitiveCollection,
      color.name,
      'COLOR',
      hexToRgb(color.value)
    );
    primitiveMap.set(color.name, variable);
    variableMap.set(color.name, variable);
  }

  for (const space of system.primitives.spacing) {
    const variable = await getOrCreateVariable(
      primitiveCollection,
      space.name,
      'FLOAT',
      space.value
    );
     primitiveMap.set(space.name, variable);
     variableMap.set(space.name, variable);
  }

  for (const rad of system.primitives.radius) {
      const variable = await getOrCreateVariable(
        primitiveCollection,
        rad.name,
        'FLOAT',
        rad.value
      );
       primitiveMap.set(rad.name, variable);
       variableMap.set(rad.name, variable);
    }

  // 3. Create Semantics (Variables referencing Primitives)
  for (const semantic of system.semantics.colors) {
    const primitiveVar = primitiveMap.get(semantic.reference);
    if (primitiveVar) {
      const variable = await getOrCreateVariable(
        tokenCollection,
        semantic.name,
        'COLOR',
        { type: 'VARIABLE_ALIAS', id: primitiveVar.id }
      );
      variableMap.set(semantic.name, variable);
    } else {
        console.warn(`Primitive ${semantic.reference} not found for ${semantic.name}`);
    }
  }

  // 4. Create Typography (Styles)
  await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // Load default fallback

  for (const typo of system.typography) {
      try {
        await figma.loadFontAsync({ family: typo.fontFamily, style: typeof typo.fontWeight === 'string' ? typo.fontWeight : "Regular" });
      } catch (e) {
          console.warn(`Could not load font ${typo.fontFamily}`, e);
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      }

      const style = await getOrCreateTextStyle(typo.name);
      style.fontName = { family: typo.fontFamily, style: typeof typo.fontWeight === 'string' ? typo.fontWeight : "Regular" };
      style.fontSize = typo.fontSize;
      styleMap.set(typo.name, style);
  }

  return { variableMap, styleMap };
}

async function generateComponents(
  components: ComponentNode[],
  variableMap: VariableMap,
  styleMap: StyleMap
) {
  // Create a container frame for the new components
  const container = figma.createFrame();
  container.name = "Generated Components";
  container.layoutMode = "VERTICAL";
  container.primaryAxisSizingMode = "AUTO";
  container.counterAxisSizingMode = "AUTO";
  container.itemSpacing = 40;
  container.paddingLeft = 40;
  container.paddingRight = 40;
  container.paddingTop = 40;
  container.paddingBottom = 40;

  for (const componentData of components) {
    const node = await createComponent(componentData, variableMap, styleMap);
    container.appendChild(node);
  }

  figma.viewport.scrollAndZoomIntoView([container]);
}

// --- Helpers ---

async function getOrCreateCollection(name: string): Promise<VariableCollection> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const existing = collections.find(c => c.name === name);
  if (existing) return existing;
  return figma.variables.createVariableCollection(name);
}

async function getOrCreateVariable(
  collection: VariableCollection,
  name: string,
  type: VariableResolvedDataType,
  value: VariableValue
): Promise<Variable> {
  const variables = await figma.variables.getLocalVariablesAsync(); // This gets ALL variables. Optimized approach: filter by collection later if needed.
  // Better: collection.variableIds. But we need to check names.

  // Simple search for MVP
  const existing = variables.find(v => v.variableCollectionId === collection.id && v.name === name);
  if (existing) {
      // Update value
      existing.setValueForMode(collection.defaultModeId, value);
      return existing;
  }

  const variable = figma.variables.createVariable(name, collection.id, type);
  variable.setValueForMode(collection.defaultModeId, value);
  return variable;
}

async function getOrCreateTextStyle(name: string): Promise<TextStyle> {
    const styles = await figma.getLocalTextStylesAsync();
    const existing = styles.find(s => s.name === name);
    if (existing) return existing;
    return figma.createTextStyle();
}

function hexToRgb(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1
  } : { r: 0, g: 0, b: 0, a: 1 };
}
