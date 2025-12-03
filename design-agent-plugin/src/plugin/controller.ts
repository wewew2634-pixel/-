// This file holds the main code for the plugins. It runs in the same sandbox as a browser script
// but doesn't have access to the DOM or other browser APIs.

// This file is compiled via a separate build step (esbuild or vite lib mode)
// For now, we assume it will be built to dist/code.js

console.log('Plugin backend running');

figma.showUI(__html__, { width: 400, height: 600 });

import { PluginMessageSchema } from '../common/schema';
import type { DesignSystem } from '../common/schema';

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
    await generateSystem(validatedMsg.payload);
    figma.notify('Design System Generated!');
  }
};

async function generateSystem(system: DesignSystem) {
  // 1. Create/Find Variable Collections
  const primitiveCollection = await getOrCreateCollection('Primitives');
  const tokenCollection = await getOrCreateCollection('Tokens');

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
  }

  for (const space of system.primitives.spacing) {
    const variable = await getOrCreateVariable(
      primitiveCollection,
      space.name,
      'FLOAT',
      space.value
    );
     primitiveMap.set(space.name, variable);
  }

  for (const rad of system.primitives.radius) {
      const variable = await getOrCreateVariable(
        primitiveCollection,
        rad.name,
        'FLOAT',
        rad.value
      );
       primitiveMap.set(rad.name, variable);
    }

  // 3. Create Semantics (Variables referencing Primitives)
  for (const semantic of system.semantics.colors) {
    const primitiveVar = primitiveMap.get(semantic.reference);
    if (primitiveVar) {
      // Create a variable in the token collection
      // We are assigning it to a variable, but ignoring the return value for now.
      await getOrCreateVariable(
        tokenCollection,
        semantic.name,
        'COLOR',
        { type: 'VARIABLE_ALIAS', id: primitiveVar.id }
      );
    } else {
        console.warn(`Primitive ${semantic.reference} not found for ${semantic.name}`);
    }
  }

  // 4. Create Typography (Styles)
  // Note: Typography variables are coming to Figma, but for now Styles are standard.
  // We won't bind colors here yet for simplicity in MVP, but we could if we passed semantic color names.
  await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // Load default fallback

  for (const typo of system.typography) {
      // Need to load the specific font first.
      // For MVP, we might skip loading all custom fonts and default to Inter or try/catch.
      try {
        await figma.loadFontAsync({ family: typo.fontFamily, style: typeof typo.fontWeight === 'string' ? typo.fontWeight : "Regular" });
      } catch (e) {
          console.warn(`Could not load font ${typo.fontFamily}`, e);
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      }

      const style = await getOrCreateTextStyle(typo.name);
      style.fontName = { family: typo.fontFamily, style: typeof typo.fontWeight === 'string' ? typo.fontWeight : "Regular" };
      style.fontSize = typo.fontSize;
      // style.lineHeight = ...
  }
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
