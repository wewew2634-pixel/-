import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import type { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface SmartCropperProps {
  imageSrc: string;
  onConfirm: (base64Crop: string) => void;
  onConfirmVariations?: (base64Crop: string) => void;
  onCancel: () => void;
  title: string;
  buttonLabel: string;
  showVariationOption?: boolean;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function SmartCropper({ imageSrc, onConfirm, onConfirmVariations, onCancel, title, buttonLabel, showVariationOption }: SmartCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 16 / 9));
  }

  async function handleConfirm(isVariation: boolean = false) {
    if (completedCrop && imgRef.current) {
      const canvas = document.createElement('canvas');
      const crop = completedCrop;
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
          return;
      }

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';
      ctx.save();

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      // const cropWidth = crop.width * scaleX;
      // const cropHeight = crop.height * scaleY;

      ctx.translate(-cropX, -cropY);
      ctx.drawImage(
        imgRef.current,
        0,
        0,
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight,
        0,
        0,
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight,
      );

      ctx.restore();

      // Convert to Base64
      const base64 = canvas.toDataURL('image/png');
      if (isVariation && onConfirmVariations) {
          onConfirmVariations(base64);
      } else {
          onConfirm(base64);
      }
    } else {
        if(imgRef.current) onConfirm(imageSrc);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-auto flex justify-center bg-gray-900 rounded border border-gray-700">
           <ReactCrop
             crop={crop}
             onChange={(_, percentCrop) => setCrop(percentCrop)}
             onComplete={(c) => setCompletedCrop(c)}
             className="max-h-full"
           >
             <img
               ref={imgRef}
               src={imageSrc}
               alt="Crop me"
               onLoad={onImageLoad}
               className="max-w-full" // Ensure image fits within the container width
               style={{ maxHeight: '60vh' }} // Limit height
             />
           </ReactCrop>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
            <button onClick={onCancel} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>

            {showVariationOption && onConfirmVariations && (
                <button
                    onClick={() => handleConfirm(true)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded border border-purple-500"
                >
                    ✨ Generate 3 Variations
                </button>
            )}

            <button
                onClick={() => handleConfirm(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
            >
                {buttonLabel}
            </button>
        </div>
      </div>
    </div>
  );
}
