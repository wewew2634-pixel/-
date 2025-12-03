import { useState } from 'react';
import React from 'react';
import './index.css';
import { PluginMessageSchema } from '../common/schema';

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
    if (!previewImage) return;

    setIsUploading(true);

    try {
        const { analyzeImage } = await import('./services/openai');
        const data = await analyzeImage(apiKey, previewImage);

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
        disabled={isUploading || !apiKey || !previewImage}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Analyzing...' : apiKey ? 'Generate System & Components' : 'Set API Key First'}
      </button>
    </div>
  );
}

export default App;
