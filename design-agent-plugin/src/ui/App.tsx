import { useState } from 'react';
import './index.css';
import { PluginMessageSchema } from '../common/schema';
import type { DesignSystem } from '../common/schema';

// Mock Data Service
const generateMockSystem = (): DesignSystem => ({
  primitives: {
    colors: [
      { name: 'blue-500', value: '#3B82F6' },
      { name: 'neutral-900', value: '#171717' },
      { name: 'neutral-100', value: '#F5F5F5' },
    ],
    spacing: [
      { name: 'space-4', value: 16 },
      { name: 'space-8', value: 32 },
    ],
    radius: [
      { name: 'radius-sm', value: 4 },
      { name: 'radius-md', value: 8 },
    ]
  },
  semantics: {
    colors: [
      { name: 'primary-bg', reference: 'blue-500' },
      { name: 'text-main', reference: 'neutral-900' },
      { name: 'surface-bg', reference: 'neutral-100' },
    ],
  },
  typography: [
    { name: 'Heading/H1', fontFamily: 'Inter', fontWeight: 'Bold', fontSize: 32 },
    { name: 'Body/Regular', fontFamily: 'Inter', fontWeight: 'Regular', fontSize: 16 },
  ],
});

function App() {
  const [isUploading, setIsUploading] = useState(false);

  const handleGenerate = () => {
    setIsUploading(true);
    // Simulate API delay
    setTimeout(() => {
      const mockSystem = generateMockSystem();

      const message = {
        type: 'GENERATE_SYSTEM',
        payload: mockSystem
      };

      // Validate before sending (Good practice, even though Plugin checks too)
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
        {isUploading ? 'Analyzing...' : 'Generate System'}
      </button>
    </div>
  );
}

export default App;
