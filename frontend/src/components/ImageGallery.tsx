import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface GeneratedImage {
  imageUrl: string;
  revisedPrompt: string;
  processingTime: number;
  model: string;
  size: string;
  costEstimate: number;
  usageCount: number;
  createdAt: string;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const { error: showError } = useToast();

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `visual-aid-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (image: GeneratedImage) => {
    try {
      await navigator.share({
        title: 'Visual Aid',
        text: `Generated visual aid for: ${image.revisedPrompt}`,
        url: image.imageUrl
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(image.imageUrl);
      showError('Link Copied', 'Image URL copied to clipboard');
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No images generated yet. Generate some visual aids to see them here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="relative">
            <img
              src={image.imageUrl}
              alt={`Generated visual aid ${index + 1}`}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(image)}
                className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => handleShare(image)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p className="line-clamp-2"><strong>Prompt:</strong> {image.revisedPrompt}</p>
              <p><strong>Model:</strong> {image.model}</p>
              <p><strong>Created:</strong> {new Date(image.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;