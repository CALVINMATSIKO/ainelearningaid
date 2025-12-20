import React, { useState } from 'react';
import { Download, Share2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';
import Loading from './ui/Loading';

// Security constants
const FORBIDDEN_KEYWORDS = [
  'violence', 'violent', 'kill', 'murder', 'death', 'blood', 'gore', 'torture', 'abuse',
  'explicit', 'sex', 'nude', 'naked', 'porn', 'erotic', 'adult', 'nsfw',
  'hate', 'racist', 'racism', 'discrimination', 'slur', 'offensive', 'bigot'
];

const MAX_REQUESTS_PER_SESSION = 10;
const STORAGE_KEY = 'imageGenRequests';

const sanitizePrompt = (prompt: string): string => {
  let sanitized = prompt.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED]');
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED]');
  sanitized = sanitized.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[REDACTED]');
  return sanitized;
};

const checkForbiddenKeywords = (prompt: string): boolean => {
  const lowerPrompt = prompt.toLowerCase();
  return FORBIDDEN_KEYWORDS.some(keyword => lowerPrompt.includes(keyword));
};

const checkRateLimit = (): boolean => {
  const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  return count >= MAX_REQUESTS_PER_SESSION;
};

const incrementRequestCount = () => {
  const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  localStorage.setItem(STORAGE_KEY, (count + 1).toString());
};

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

interface ImageGeneratorProps {
  prompt: string;
  subject: string;
  disabled?: boolean;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  prompt,
  subject,
  disabled = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const { error: showError } = useToast();

  // Check if prompt contains visual aid keywords
  const visualAidKeywords = ["diagram", "timeline", "structure", "process", "map", "graph"];
  const hasVisualAidKeywords = visualAidKeywords.some(keyword =>
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!prompt.trim() || !subject) {
      showError('Missing Information', 'Please provide a prompt and select a subject');
      return;
    }

    const sanitizedPrompt = sanitizePrompt(prompt);
    if (checkForbiddenKeywords(sanitizedPrompt)) {
      showError('Inappropriate Content', 'Your prompt contains forbidden content. Please revise and try again.');
      return;
    }

    if (checkRateLimit()) {
      showError('Rate Limit Exceeded', 'You have reached the maximum number of image generations for this session.');
      return;
    }

    incrementRequestCount();

    setIsGenerating(true);
    try {
      const result = await apiService.generateImage({
        prompt: sanitizedPrompt.trim(),
        subject
      });
      setGeneratedImage(result);
    } catch (err: any) {
      console.error('Image generation failed:', err);
      const errorMessage = err?.message || err?.toString() || 'Unknown error';

      if (errorMessage.includes('rate limit') || errorMessage.includes('RATE_LIMIT_EXCEEDED')) {
        showError('Rate Limit Exceeded', 'Rate limit exceeded, try again in 15 minutes');
      } else if (errorMessage.includes('cost limit') || errorMessage.includes('COST_LIMIT')) {
        showError('Cost Limit Reached', 'Cost limit reached for this session');
      } else {
        showError('Image Generation Failed', 'Image generation failed, please try again');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = `visual-aid-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      await navigator.share({
        title: 'Visual Aid',
        text: `Generated visual aid for: ${generatedImage.revisedPrompt}`,
        url: generatedImage.imageUrl
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(generatedImage.imageUrl);
      showError('Link Copied', 'Image URL copied to clipboard');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Visual Aid Generator
        </h3>
        <ImageIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
      </div>

      {hasVisualAidKeywords && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 Your question seems to benefit from a visual aid! Consider generating a diagram, timeline, or graph to enhance understanding.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Estimated cost: $0.04 per image</p>
          {generatedImage && (
            <p>Usage: {generatedImage.usageCount} requests this session</p>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={disabled || isGenerating || !prompt.trim() || !subject}
          className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loading size="sm" text="" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5" />
              Generate Visual Aid
            </>
          )}
        </button>

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={generatedImage.imageUrl}
                alt="Generated visual aid"
                className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                loading="lazy"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>Revised Prompt:</strong> {generatedImage.revisedPrompt}</p>
              <p><strong>Model:</strong> {generatedImage.model}</p>
              <p><strong>Processing Time:</strong> {generatedImage.processingTime}ms</p>
              <p><strong>Cost:</strong> ${generatedImage.costEstimate.toFixed(2)}</p>
              <p><strong>Usage Count:</strong> {generatedImage.usageCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;