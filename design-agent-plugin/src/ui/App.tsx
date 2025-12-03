import { useState } from 'react';
import './index.css';
import { PluginMessageSchema } from '../common/schema';
import type { DesignSystem, ComponentNode } from '../common/schema';

// Mock Data Service
const generateMockData = (): { system: DesignSystem; components: ComponentNode[] } => {
  const system: DesignSystem = {
    primitives: {
      colors: [
        { name: 'blue-500', value: '#3B82F6' },
        { name: 'blue-600', value: '#2563EB' }, // Hover state
        { name: 'neutral-900', value: '#171717' },
        { name: 'neutral-100', value: '#F5F5F5' },
        { name: 'neutral-500', value: '#737373' }, // Placeholder/Border
        { name: 'white', value: '#FFFFFF' },
      ],
      spacing: [
        { name: 'space-2', value: 8 },
        { name: 'space-3', value: 12 },
        { name: 'space-4', value: 16 },
        { name: 'space-6', value: 24 },
      ],
      radius: [
        { name: 'radius-sm', value: 4 },
        { name: 'radius-md', value: 8 },
        { name: 'radius-lg', value: 12 },
      ]
    },
    semantics: {
      colors: [
        { name: 'primary-bg', reference: 'blue-500' },
        { name: 'text-main', reference: 'neutral-900' },
        { name: 'text-inverse', reference: 'white' },
        { name: 'surface-bg', reference: 'white' },
        { name: 'border-default', reference: 'neutral-500' },
      ],
    },
    typography: [
      { name: 'Heading/H1', fontFamily: 'Inter', fontWeight: 'Bold', fontSize: 32 },
      { name: 'Body/Regular', fontFamily: 'Inter', fontWeight: 'Regular', fontSize: 16 },
      { name: 'Label/Medium', fontFamily: 'Inter', fontWeight: 'Medium', fontSize: 14 },
    ],
  };

  const components: ComponentNode[] = [
    // 1. Primary Button (Horizontal Auto Layout)
    {
      name: "Button/Primary",
      type: "FRAME",
      layoutMode: "HORIZONTAL",
      primaryAxisSizingMode: "AUTO", // Hug
      counterAxisSizingMode: "AUTO", // Hug
      paddingX: "space-4", // 16px
      paddingY: "space-3", // 12px
      itemSpacing: "space-2", // 8px
      fill: "primary-bg", // Variable Binding!
      radius: "radius-md", // Variable Binding!
      children: [
        {
          name: "Label",
          type: "TEXT",
          content: "Get Started",
          style: "Body/Regular",
          color: "text-inverse" // White text on Blue bg
        }
      ]
    },

    // 2. Input Field (Vertical Stack: Label + Input Box)
    {
      name: "Input Field",
      type: "FRAME",
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "FIXED",
      width: 320,
      counterAxisSizingMode: "AUTO",
      itemSpacing: "space-2",
      children: [
        {
          name: "Label",
          type: "TEXT",
          content: "Email Address",
          style: "Label/Medium",
          color: "text-main"
        },
        {
          name: "Input Box",
          type: "FRAME",
          layoutMode: "HORIZONTAL",
          primaryAxisSizingMode: "AUTO", // Fill container (controlled by parent width)
          counterAxisSizingMode: "AUTO",
          width: 320, // Should be fill, but fixed for now
          height: 48,
          paddingX: "space-3",
          paddingY: "space-3",
          stroke: "border-default",
          radius: "radius-md",
          children: [
             {
               name: "Placeholder",
               type: "TEXT",
               content: "name@example.com",
               style: "Body/Regular",
               color: "border-default"
             }
          ]
        }
      ]
    },

    // 3. Card (Nested Auto Layout)
    {
      name: "Card Component",
      type: "FRAME",
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "FIXED",
      width: 340,
      counterAxisSizingMode: "AUTO",
      fill: "surface-bg",
      radius: "radius-lg",
      padding: 0, // No padding on outer frame
      // Shadow would go here (Effects not yet supported in schema)
      children: [
        // Image Placeholder
        {
          name: "Image Area",
          type: "FRAME",
          layoutMode: "VERTICAL",
          primaryAxisSizingMode: "FIXED",
          counterAxisSizingMode: "FIXED",
          width: 340,
          height: 200,
          fill: "neutral-500", // Grey placeholder
          children: []
        },
        // Content Area
        {
          name: "Content",
          type: "FRAME",
          layoutMode: "VERTICAL",
          primaryAxisSizingMode: "AUTO",
          counterAxisSizingMode: "AUTO",
          padding: "space-6", // 24px
          itemSpacing: "space-4",
          children: [
            {
              name: "Title",
              type: "TEXT",
              content: "Design Systems 101",
              style: "Heading/H1",
              color: "text-main"
            },
            {
              name: "Description",
              type: "TEXT",
              content: "Learn how to build scalable UI libraries with Figma variables and auto layout.",
              style: "Body/Regular",
              color: "text-main"
            },
            // Nested Button
             {
              name: "Button/Secondary",
              type: "FRAME",
              layoutMode: "HORIZONTAL",
              primaryAxisSizingMode: "AUTO",
              counterAxisSizingMode: "AUTO",
              paddingX: "space-4",
              paddingY: "space-3",
              stroke: "border-default",
              radius: "radius-md",
              children: [
                {
                  name: "Label",
                  type: "TEXT",
                  content: "Read More",
                  style: "Body/Regular",
                  color: "text-main"
                }
              ]
            },
          ]
        }
      ]
    }
  ];

  return { system, components };
};

function App() {
  const [isUploading, setIsUploading] = useState(false);

  const handleGenerate = () => {
    setIsUploading(true);
    // Simulate API delay
    setTimeout(() => {
      const { system, components } = generateMockData();

      const message = {
        type: 'GENERATE_SYSTEM',
        payload: { system, components }
      };

      // Validate before sending
      const result = PluginMessageSchema.safeParse(message);
      if(result.success) {
          parent.postMessage({ pluginMessage: message }, '*');
      } else {
          console.error("Schema Validation Failed on UI", result.error);
      }

      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Design Agent</h1>
      <p className="text-gray-400 text-center">Upload a moodboard to generate your design system.</p>

      <div className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800">
        <span className="text-gray-500">Drag & Drop Image (Mock for MVP)</span>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isUploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
      >
        {isUploading ? 'Analyzing...' : 'Generate System & Components'}
      </button>
    </div>
  );
}

export default App;
