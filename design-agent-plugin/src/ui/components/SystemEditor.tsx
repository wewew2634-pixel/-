import { useState } from 'react';
import { ChromePicker } from 'react-color';
import type { DesignSystem } from '../../common/schema';
import { getContrastColor } from '../utils/color';

interface SystemEditorProps {
  system: DesignSystem;
  onApply: (modifiedSystem: DesignSystem) => void;
  onCancel: () => void;
}

export function SystemEditor({ system, onApply, onCancel }: SystemEditorProps) {
  const [editedSystem, setEditedSystem] = useState<DesignSystem>(system);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);

  const handleColorChange = (index: number, newHex: string) => {
    const newColors = [...editedSystem.primitives.colors];
    newColors[index] = { ...newColors[index], value: newHex };
    setEditedSystem({
      ...editedSystem,
      primitives: {
        ...editedSystem.primitives,
        colors: newColors,
      },
    });
  };

  const handleNameChange = (index: number, newName: string, type: 'primitive' | 'semantic') => {
    if (type === 'primitive') {
        const newColors = [...editedSystem.primitives.colors];
        newColors[index] = { ...newColors[index], name: newName };
        setEditedSystem({
            ...editedSystem,
            primitives: { ...editedSystem.primitives, colors: newColors }
        });
    } else {
        const newSemantics = [...editedSystem.semantics.colors];
        newSemantics[index] = { ...newSemantics[index], name: newName };
        setEditedSystem({
            ...editedSystem,
            semantics: { ...editedSystem.semantics, colors: newSemantics }
        });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-bold">Staging Area: Review System</h2>
        <p className="text-xs text-gray-400">Review and tweak your tokens before generating.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Primitives Section */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Primitive Colors</h3>
          <div className="grid grid-cols-1 gap-3">
            {editedSystem.primitives.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-3 bg-gray-800 p-2 rounded border border-gray-700">
                <div className="relative">
                    <div
                        className="w-10 h-10 rounded cursor-pointer border border-gray-600 shadow-sm"
                        style={{ backgroundColor: color.value }}
                        onClick={() => setActiveColorIndex(activeColorIndex === index ? null : index)}
                    />
                    {activeColorIndex === index && (
                        <div className="absolute top-12 left-0 z-50">
                            <div className="fixed inset-0" onClick={() => setActiveColorIndex(null)} />
                            <ChromePicker
                                color={color.value}
                                onChange={(c) => handleColorChange(index, c.hex)}
                                disableAlpha
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-1">
                    <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleNameChange(index, e.target.value, 'primitive')}
                        className="w-full bg-transparent border-b border-gray-600 text-sm focus:outline-none focus:border-blue-500 pb-1"
                    />
                    <div className="text-xs text-gray-500 font-mono">{color.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semantics Section */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-300">Semantic Tokens</h3>
          <div className="space-y-2">
            {editedSystem.semantics.colors.map((semantic, index) => {
                const primitive = editedSystem.primitives.colors.find(p => p.name === semantic.reference);
                const hex = primitive ? primitive.value : '#000000';

                return (
                    <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                        <div className="flex-1">
                             <input
                                type="text"
                                value={semantic.name}
                                onChange={(e) => handleNameChange(index, e.target.value, 'semantic')}
                                className="w-full bg-transparent text-sm font-medium focus:outline-none text-blue-200"
                            />
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <span>Ref: </span>
                                <span
                                    className="ml-1 px-1.5 py-0.5 rounded text-[10px]"
                                    style={{ backgroundColor: hex, color: getContrastColor(hex) }}
                                >
                                    {semantic.reference}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800 flex space-x-3">
        <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm text-gray-400 hover:text-white"
        >
            Discard
        </button>
        <button
            onClick={() => onApply(editedSystem)}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-lg"
        >
            Apply System
        </button>
      </div>
    </div>
  );
}
