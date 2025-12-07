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

type WizardState = 'UPLOAD' | 'MOODBOARD_VIEW' | 'CROP_SYSTEM' | 'STAGING_SYSTEM' | 'SYSTEM_DONE' | 'CROP_COMPONENT' | 'ALL_DONE';

function App() {
  const [status, setStatus] = useState<WizardState>('UPLOAD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const [images, setImages] = useState<string[]>([]); // Store multiple images
  const [originalImage, setOriginalImage] = useState<string | null>(null); // Active image for cropping

  const [extractedPalette, setExtractedPalette] = useState<string[]>([]);
  const [stagingSystem, setStagingSystem] = useState<DesignSystem | null>(null);

  // Error State Handling
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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
    // API Key Validation before saving
    if (!apiKey.startsWith('sk-') || apiKey.length < 50) {
        setError("Invalid OpenAI API Key format.");
        return;
    }
    setError(null);
    parent.postMessage({ pluginMessage: { type: 'SAVE_API_KEY', apiKey } }, '*');
    setShowKeyInput(false);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
      });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setError(null);
    if (files && files.length > 0) {
      const loadedImages: string[] = [];

      // Process files
      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const base64 = await readFileAsDataURL(file);
          loadedImages.push(base64);

          // For the first image, try to extract palette as quick feedback
          if (i === 0) {
              try {
                  const compressed = await compressImage(file);
                  const colors = await extractColors(compressed);
                  setExtractedPalette(colors); // Set from first image for now
              } catch (err) {
                  console.error("Local processing error:", err);
              }
          }
      }

      setImages(loadedImages);

      if (loadedImages.length === 1) {
          setOriginalImage(loadedImages[0]);
          setStatus('CROP_SYSTEM');
      } else {
          setOriginalImage(loadedImages[0]); // Default to first
          setStatus('MOODBOARD_VIEW');
      }
    }
  };

  const handleSelectImageForCrop = (img: string) => {
      setOriginalImage(img);
      setStatus('CROP_SYSTEM');
  };

  // Analyze System from single crop OR multiple full images
  const handleSystemAnalysis = async (input: string | string[]) => {
    setIsProcessing(true);
    setError(null);

    try {
        const { analyzeImage, validateApiKey } = await import('./services/openai');

        if (!apiKey) {
             // Mock Data Fallback (Dev Mode or No Key)
            const primitives = extractedPalette.length > 0
                ? extractedPalette.map((hex, i) => ({ name: `color-${i+1}`, value: hex }))
                : [{name: 'blue-500', value: '#3B82F6'}, {name: 'neutral-100', value: '#F5F5F5'}];

            const mockData = (await import('../common/schema')).DesignSystemSchema.parse({
                primitives: {
                    colors: primitives,
                    spacing: [
                        {name: 'space-2', value: 8},
                        {name: 'space-4', value: 16},
                        {name: 'space-6', value: 24}
                    ],
                    radius: [
                        {name: 'radius-sm', value: 4},
                        {name: 'radius-md', value: 8}
                    ]
                },
                semantics: {
                    colors: [
                        {name: 'sys-bg-primary', reference: primitives[0].name},
                        {name: 'sys-bg-surface', reference: primitives[2]?.name || primitives[1].name}
                    ]
                },
                typography: [
                    {
                        name: 'Headline/Large',
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        fontSize: 24
                    }
                ],
                effects: [
                    {
                        name: 'elevation-sm',
                        type: 'DROP_SHADOW',
                        value: { x: 0, y: 2, blur: 4, color: '#000000', opacity: 0.1 }
                    }
                ]
            });
            setStagingSystem(mockData);
        } else {
            // Validation
            const validation = validateApiKey(apiKey);
            if (!validation.valid) {
                throw new Error(validation.message || 'Invalid API Key');
            }

            // Hybrid Request
            // input can be single string (crop) or array (moodboard)
            const data = await analyzeImage(
                apiKey,
                input,
                SYSTEM_ONLY_PROMPT,
                extractedPalette,
                {
                    maxTokens: 4000,
                    temperature: 0.2,
                    timeout: 90000 // 90s
                }
            );

            if (data.system) {
                setStagingSystem(data.system);
            } else {
                throw new Error("Could not generate design system.");
            }
        }

        setStatus('STAGING_SYSTEM');
        setRetryCount(0);
    } catch (e: any) {
        console.error('System Analysis Failed:', e);
        const errorMessage = e.message || 'Unknown error occurred.';
        setError(errorMessage);

        // Auto-Retry Logic (Simple)
        if (retryCount < 2 && apiKey && !errorMessage.includes('API')) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
                handleSystemAnalysis(input);
            }, 3000);
            return;
        }

        // Fallback in Dev
        if (process.env.NODE_ENV === 'development') {
            console.log("Dev Mode: Fallback to Mock due to error");
            // Call recursively without API key to trigger mock?
            // Better not to risk infinite loop here, just stay on error state or let user retry manually.
        }

        setStatus('UPLOAD');
    } finally {
        setIsProcessing(false);
    }
  };

  // Wrapper for Single Crop
  const handleSystemCrop = (cropBase64: string) => {
      handleSystemAnalysis(cropBase64);
  }

  // Wrapper for Batch
  const handleBatchSystemAnalysis = () => {
      handleSystemAnalysis(images);
  }

  const handleApplySystem = (modifiedSystem: DesignSystem) => {
      const message = { type: 'GENERATE_SYSTEM_ONLY', payload: { system: modifiedSystem } };
      parent.postMessage({ pluginMessage: message }, '*');
      setStatus('SYSTEM_DONE');
  };

  const handleComponentCrop = async (cropBase64: string, mode: 'SINGLE' | 'VARIATIONS' = 'SINGLE') => {
    setIsProcessing(true);
    setError(null);
    try {
        const { analyzeImage } = await import('./services/openai');
        if (apiKey) {
             const prompt = mode === 'VARIATIONS' ? VARIATION_PROMPT : COMPONENT_ONLY_PROMPT;
             // Single component crop always
             const data = await analyzeImage(apiKey, cropBase64, prompt);
             const message = { type: 'GENERATE_COMPONENT_ONLY', payload: data };
             parent.postMessage({ pluginMessage: message }, '*');
        } else {
             console.log("Generating M3 Mock Components");
             const message = { type: 'GENERATE_COMPONENT_ONLY', payload: { components: M3_MOCK_COMPONENTS } };
             parent.postMessage({ pluginMessage: message }, '*');
        }
        setStatus('SYSTEM_DONE');
    } catch (e: any) {
        const msg = e.message || "Component Generation Failed";
        setError(msg);
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

      {/* Global Error UI */}
      {error && (
        <div className="w-full bg-red-900/30 border border-red-600 rounded-lg p-4 space-y-2 animate-pulse">
            <h3 className="text-red-400 font-bold">Error</h3>
            <p className="text-red-200 text-sm">{error}</p>
            <div className="flex space-x-2">
            <button
                onClick={() => setError(null)}
                className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1 rounded"
            >
                Dismiss
            </button>
            {retryCount < 2 && (
                <button
                    onClick={() => {
                        setRetryCount(0);
                        // Can't easily auto-retry exact function without passing state,
                        // but user can just click the button again.
                        // Ideally we clear error and let user click 'Analyze' again.
                        setError(null);
                    }}
                    className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded"
                >
                Try Again
                </button>
            )}
            </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">

          {status === 'UPLOAD' && (
              <div className="w-full text-center space-y-4">
                  <p className="text-gray-400">Step 1: Upload Moodboard (Multiple supported)</p>
                  <div className="relative w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-800">
                      <span className="text-gray-500">Click to Upload</span>
                      <input type="file" accept="image/*" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  </div>
              </div>
          )}

          {status === 'MOODBOARD_VIEW' && (
              <div className="w-full h-full flex flex-col space-y-4">
                  <h3 className="text-lg font-bold">Moodboard ({images.length} images)</h3>
                  <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 p-2 bg-gray-800 rounded">
                      {images.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square bg-gray-900">
                              <img src={img} className="w-full h-full object-cover" />
                              <button
                                  onClick={() => handleSelectImageForCrop(img)}
                                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold"
                              >
                                  Crop This
                              </button>
                          </div>
                      ))}
                  </div>
                  <div className="flex space-x-2">
                       <button
                          onClick={handleBatchSystemAnalysis}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
                       >
                           {isProcessing ? "Analyzing All..." : "Analyze Whole Moodboard"}
                       </button>
                       <button onClick={() => setStatus('UPLOAD')} className="px-4 py-2 bg-gray-700 rounded">Back</button>
                  </div>
              </div>
          )}

          {status === 'CROP_SYSTEM' && originalImage && (
              <SmartCropper
                  imageSrc={originalImage}
                  title="Step 2: Select Main Theme (Anchor)"
                  buttonLabel={isProcessing ? "Analyzing..." : "Analyze Theme"}
                  onConfirm={handleSystemCrop}
                  onCancel={() => setStatus(images.length > 1 ? 'MOODBOARD_VIEW' : 'UPLOAD')}
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
                      <p className="text-xs text-green-200">System generated from {images.length > 1 ? 'Moodboard' : 'Image'}.</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <p className="text-gray-300">Step 3: Pick a UI element to generate.</p>
                    {images.length > 1 && (
                        <div className="w-full overflow-x-auto flex space-x-2 p-2">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${originalImage === img ? 'border-blue-500' : 'border-transparent'}`}
                                    onClick={() => setOriginalImage(img)}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setStatus('CROP_COMPONENT')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                    >
                        Pick Component from Selected
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
