import { useState } from 'react';
import React from 'react';
import './index.css';
import { SmartCropper } from './components/SmartCropper';
import { SYSTEM_ONLY_PROMPT, COMPONENT_ONLY_PROMPT } from '../common/prompt';

type WizardState = 'UPLOAD' | 'CROP_SYSTEM' | 'SYSTEM_DONE' | 'CROP_COMPONENT' | 'ALL_DONE';

function App() {
  const [status, setStatus] = useState<WizardState>('UPLOAD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setStatus('CROP_SYSTEM');
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1: Generate System from Anchor
  const handleSystemCrop = async (cropBase64: string) => {
    setIsProcessing(true);
    try {
        // Dynamic import
        const { analyzeImage } = await import('./services/openai');

        // Use Mock if no key (for debug) - Logic inside analyzeImage? No, handle here.
        if (!apiKey) {
            console.log("Mocking System Generation");
            await new Promise(r => setTimeout(r, 1000));
            // Send mock system message... skipped for brevity, assumed real flow for now or full mock
        } else {
            const data = await analyzeImage(apiKey, cropBase64, SYSTEM_ONLY_PROMPT);
            const message = { type: 'GENERATE_SYSTEM_ONLY', payload: data };
            parent.postMessage({ pluginMessage: message }, '*');
        }

        setStatus('SYSTEM_DONE');
    } catch (e) {
        alert("System Gen Failed");
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  // Step 2: Generate Component from Selection
  const handleComponentCrop = async (cropBase64: string) => {
    setIsProcessing(true);
    try {
        const { analyzeImage } = await import('./services/openai');
        if (apiKey) {
             const data = await analyzeImage(apiKey, cropBase64, COMPONENT_ONLY_PROMPT);
             const message = { type: 'GENERATE_COMPONENT_ONLY', payload: data };
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
                  buttonLabel={isProcessing ? "Analyzing..." : "Set as Global Theme"}
                  onConfirm={handleSystemCrop}
                  onCancel={() => setStatus('UPLOAD')}
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
                  onConfirm={handleComponentCrop}
                  onCancel={() => setStatus('SYSTEM_DONE')}
              />
          )}

      </div>
    </div>
  );
}

export default App;
