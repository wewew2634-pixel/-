import { useState } from 'react';
import React from 'react';
import './index.css';
import { SmartCropper } from './components/SmartCropper';
import { SystemEditor } from './components/SystemEditor';
import { SYSTEM_ONLY_PROMPT, COMPONENT_ONLY_PROMPT, VARIATION_PROMPT } from '../common/prompt';
import type { DesignSystem } from '../common/schema';
import { compressImage } from './utils/image';
import { extractColors } from './utils/palette';
import { M3_MOCK_COMPONENTS } from './mock/m3_data';

type WizardState = 'UPLOAD' | 'CROP_SYSTEM' | 'STAGING_SYSTEM' | 'SYSTEM_DONE' | 'CROP_COMPONENT' | 'ALL_DONE';

function App() {
  const [status, setStatus] = useState<WizardState>('UPLOAD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  // const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [stagingSystem, setStagingSystem] = useState<DesignSystem | null>(null);

  React.useEffect(() => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Show Original Preview immediately (User feedback)
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setStatus('CROP_SYSTEM');
      };
      reader.readAsDataURL(file);

      // 2. Background Processing (Hybrid Engine)
      try {
          // Compress for AI efficiency
          const compressed = await compressImage(file);
          // setCompressedImage(compressed);
          console.log("Image compressed");

          // Extract Colors locally (Immediate feedback in future UI, currently stored)
          const colors = await extractColors(compressed);
          setExtractedPalette(colors);
          console.log("Colors extracted:", colors);
      } catch (err) {
          console.error("Local processing error:", err);
      }
    }
  };

  // Step 1: Analyze System from Anchor -> Go to Staging
  const handleSystemCrop = async (cropBase64: string) => {
    setIsProcessing(true);
    try {
        const { analyzeImage } = await import('./services/openai');

        if (!apiKey) {
            // Hybrid Mock: Use extracted palette if available
            const primitives = extractedPalette.length > 0
                ? extractedPalette.map((hex, i) => ({ name: `color-${i+1}`, value: hex }))
                : [{name: 'blue-500', value: '#3B82F6'}, {name: 'neutral-100', value: '#F5F5F5'}];

            const mockData = (await import('../common/schema')).DesignSystemSchema.parse({
                primitives: {
                    colors: primitives,
                    spacing: [], radius: []
                },
                semantics: { colors: [{name: 'sys-bg-primary', reference: primitives[0].name}] },
                typography: [],
                effects: [
                    {
                        name: "elevation-sm",
                        type: "DROP_SHADOW",
                        value: { x: 0, y: 1, blur: 2, color: "#000000", opacity: 0.05 }
                    },
                    {
                        name: "elevation-md",
                        type: "DROP_SHADOW",
                        value: { x: 0, y: 4, blur: 6, color: "#000000", opacity: 0.1 }
                    }
                ]
            });
            setStagingSystem(mockData);
        } else {
            // Hybrid Request: Pass extracted palette to AI
            const data = await analyzeImage(apiKey, cropBase64, SYSTEM_ONLY_PROMPT, extractedPalette);
            if (data.system) {
                setStagingSystem(data.system);
            }
        }

        setStatus('STAGING_SYSTEM');
    } catch (e) {
        alert("System Analysis Failed");
        console.error(e);
        setStatus('UPLOAD'); // Reset on failure
    } finally {
        setIsProcessing(false);
    }
  };

  // Step 1.5: Apply Staging System to Figma
  const handleApplySystem = (modifiedSystem: DesignSystem) => {
      const message = { type: 'GENERATE_SYSTEM_ONLY', payload: { system: modifiedSystem } };
      parent.postMessage({ pluginMessage: message }, '*');
      setStatus('SYSTEM_DONE');
  };

  // Step 2: Generate Component from Selection (Single or Variations)
  const handleComponentCrop = async (cropBase64: string, mode: 'SINGLE' | 'VARIATIONS' = 'SINGLE') => {
    setIsProcessing(true);
    try {
        const { analyzeImage } = await import('./services/openai');
        if (apiKey) {
             const prompt = mode === 'VARIATIONS' ? VARIATION_PROMPT : COMPONENT_ONLY_PROMPT;
             const data = await analyzeImage(apiKey, cropBase64, prompt);
             const message = { type: 'GENERATE_COMPONENT_ONLY', payload: data };
             parent.postMessage({ pluginMessage: message }, '*');
        } else {
             // Mock M3 Data for Debug
             console.log("Generating M3 Mock Components");
             const message = { type: 'GENERATE_COMPONENT_ONLY', payload: { components: M3_MOCK_COMPONENTS } };
             parent.postMessage({ pluginMessage: message }, '*');
        }
        // Loop back or finish
        setStatus('SYSTEM_DONE'); // Allow picking more components
    } catch (e) {
        alert("Component Gen Failed");
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-screen flex flex-col items-center justify-start space-y-6 overflow-hidden">

      {/* Header */}
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
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white"
            placeholder="sk-..."
          />
          <button onClick={handleSaveKey} className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-3 rounded">Save Key</button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">

          {status === 'UPLOAD' && (
              <div className="w-full text-center space-y-4">
                  <p className="text-gray-400">Step 1: Upload your Moodboard or Reference Image.</p>
                  <div className="relative w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800">
                      <span className="text-gray-500">Click to Upload</span>
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  </div>
              </div>
          )}

          {status === 'CROP_SYSTEM' && originalImage && (
              <SmartCropper
                  imageSrc={originalImage}
                  title="Step 2: Select Main Theme (Anchor)"
                  buttonLabel={isProcessing ? "Analyzing..." : "Analyze Theme"}
                  onConfirm={handleSystemCrop}
                  onCancel={() => setStatus('UPLOAD')}
              />
          )}

          {status === 'STAGING_SYSTEM' && stagingSystem && (
              <SystemEditor
                  system={stagingSystem}
                  onApply={handleApplySystem}
                  onCancel={() => setStatus('CROP_SYSTEM')}
              />
          )}

          {status === 'SYSTEM_DONE' && originalImage && (
              <div className="w-full h-full flex flex-col space-y-4">
                  <div className="p-4 bg-green-900/30 border border-green-600 rounded text-center">
                      <h3 className="text-green-400 font-bold">✔ System Active</h3>
                      <p className="text-xs text-green-200">Variables & Styles are ready.</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <p className="text-gray-300">Step 3: Pick a UI element to generate.</p>
                    <button
                        onClick={() => setStatus('CROP_COMPONENT')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
                    >
                        Pick Component from Image
                    </button>
                    <button
                         onClick={() => setStatus('UPLOAD')}
                         className="text-gray-500 hover:text-white text-sm"
                    >
                        Start Over
                    </button>
                  </div>
              </div>
          )}

          {status === 'CROP_COMPONENT' && originalImage && (
              <SmartCropper
                  imageSrc={originalImage}
                  title="Step 3: Select Component"
                  buttonLabel={isProcessing ? "Generating..." : "Generate Component"}
                  onConfirm={(crop) => handleComponentCrop(crop, 'SINGLE')}
                  onConfirmVariations={(crop) => handleComponentCrop(crop, 'VARIATIONS')}
                  onCancel={() => setStatus('SYSTEM_DONE')}
                  showVariationOption={true}
              />
          )}

      </div>
    </div>
  );
}

export default App;
