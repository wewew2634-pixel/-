import { useState } from 'react';
import React from 'react';
import './index.css';
import { PluginMessageSchema } from '../common/schema';
import type { DesignSystem, ComponentNode } from '../common/schema';

// V2 Mock Data (Matrix Variant + 3-Tier Tokens)
const generateV2MockData = (): { system: DesignSystem; components: ComponentNode[] } => {
  const system: DesignSystem = {
    primitives: {
      colors: [
        { name: 'blue-500', value: '#3B82F6' },
        { name: 'blue-600', value: '#2563EB' },
        { name: 'neutral-900', value: '#171717' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'gray-200', value: '#E5E7EB' },
      ],
      spacing: [
        { name: 'space-2', value: 8 },
        { name: 'space-3', value: 12 },
        { name: 'space-4', value: 16 },
      ],
      radius: [
        { name: 'radius-md', value: 8 },
      ]
    },
    semantics: {
      colors: [
        { name: 'sys-bg-primary', reference: 'blue-500' },
        { name: 'sys-bg-primary-hover', reference: 'blue-600' },
        { name: 'sys-text-on-primary', reference: 'white' },
        { name: 'sys-border-default', reference: 'gray-200' },
        { name: 'sys-text-main', reference: 'neutral-900' },
      ],
    },
    typography: [
       { name: 'Body/Medium', fontFamily: 'Inter', fontWeight: 'Medium', fontSize: 14 },
    ],
  };

  const components: ComponentNode[] = [
    // Component Set: Button (Primary)
    {
      type: "COMPONENT_SET",
      name: "Button",
      variants: [
        // Default
        {
          type: "VARIANT",
          properties: { State: "Default", Style: "Primary" },
          structure: {
            name: "Button",
            type: "FRAME",
            layoutMode: "HORIZONTAL",
            sizing: { horizontal: "HUG", vertical: "HUG" },
            paddingX: "space-4",
            paddingY: "space-3",
            itemSpacing: "space-2",
            fill: "sys-bg-primary",
            radius: "radius-md",
            children: [
              {
                name: "Label",
                type: "TEXT",
                content: "Button",
                style: "Body/Medium",
                color: "sys-text-on-primary",
                sizing: { horizontal: "HUG", vertical: "HUG" }
              }
            ]
          }
        },
        // Hover
        {
          type: "VARIANT",
          properties: { State: "Hover", Style: "Primary" },
          structure: {
            name: "Button",
            type: "FRAME",
            layoutMode: "HORIZONTAL",
            sizing: { horizontal: "HUG", vertical: "HUG" },
            paddingX: "space-4",
            paddingY: "space-3",
            itemSpacing: "space-2",
            fill: "sys-bg-primary-hover", // Different token!
            radius: "radius-md",
            children: [
              {
                name: "Label",
                type: "TEXT",
                content: "Button",
                style: "Body/Medium",
                color: "sys-text-on-primary",
                sizing: { horizontal: "HUG", vertical: "HUG" }
              }
            ]
          }
        }
      ]
    },
    // Input Field (Demonstrating FILL sizing)
    {
      type: "FRAME",
      name: "Input Field",
      layoutMode: "VERTICAL",
      sizing: { horizontal: "FIXED", vertical: "HUG" },
      width: 300,
      itemSpacing: "space-2",
      children: [
        {
            type: "TEXT",
            name: "Label",
            content: "Email",
            style: "Body/Medium",
            color: "sys-text-main",
            sizing: { horizontal: "HUG", vertical: "HUG" }
        },
        {
            type: "FRAME",
            name: "Input Box",
            layoutMode: "HORIZONTAL",
            sizing: { horizontal: "FILL", vertical: "FIXED" }, // FILL container
            height: 40,
            stroke: "sys-border-default",
            radius: "radius-md",
            paddingX: "space-3",
            children: []
        }
      ]
    }
  ];

  return { system, components };
};

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  React.useEffect(() => {
    // Load API Key on startup
    window.onmessage = (event) => {
      const { type, apiKey } = event.data.pluginMessage;
      if (type === 'API_KEY_LOADED' && apiKey) {
        setApiKey(apiKey);
      }
    };
    parent.postMessage({ pluginMessage: { type: 'LOAD_API_KEY' } }, '*');
  }, []);

  const handleSaveKey = () => {
    parent.postMessage({ pluginMessage: { type: 'SAVE_API_KEY', apiKey } }, '*');
    setShowKeyInput(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsUploading(true);

    try {
        // For Verification/Demo purposes, if no API key is present OR if we hold Shift (simulated logic), use Mock Data.
        // In this MVP context, let's use the V2 Mock Data if no API key is set, or if the user clicks a specific button?
        // Actually, to verify the V2 engine safely without wasting API credits or if the user has no key,
        // let's add a "Debug Mode" or just fallback if API fails.
        // Better: For this phase, I will force MOCK DATA if the file input is empty but the button is clicked?
        // No, I'll just check if apiKey is empty.

        let data;
        if (!apiKey) {
            console.log("Using V2 Mock Data");
            data = generateV2MockData();
        } else if (previewImage) {
             const { analyzeImage } = await import('./services/openai');
             data = await analyzeImage(apiKey, previewImage);
        } else {
             return;
        }

        const message = {
            type: 'GENERATE_SYSTEM',
            payload: data
        };

        // Validate before sending
        const result = PluginMessageSchema.safeParse(message);
        if(result.success) {
            parent.postMessage({ pluginMessage: message }, '*');
        } else {
            console.error("Schema Validation Failed on UI", result.error);
        }

    } catch (e) {
        console.error("Analysis Failed", e);
        alert(`Analysis Failed: ${e instanceof Error ? e.message : 'Unknown Error'}`);
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">Design Agent</h1>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-xs text-gray-400 hover:text-white underline"
        >
          {apiKey ? 'Update Key' : 'Set API Key'}
        </button>
      </div>

      {showKeyInput && (
        <div className="w-full bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
          <label className="text-xs text-gray-400">OpenAI API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="sk-..."
          />
          <button
            onClick={handleSaveKey}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-3 rounded"
          >
            Save Key
          </button>
        </div>
      )}

      <p className="text-gray-400 text-center">Upload a moodboard to generate your design system.</p>

      <div className="relative w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800 overflow-hidden">
        {previewImage ? (
             <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
        ) : (
            <span className="text-gray-500 pointer-events-none">Click to Upload Image</span>
        )}
        <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isUploading || (!apiKey && !previewImage && false) /* Allow mock run if no key */}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Analyzing...' : apiKey ? 'Generate System & Components' : 'Generate Mock System (Debug)'}
      </button>
    </div>
  );
}

export default App;
