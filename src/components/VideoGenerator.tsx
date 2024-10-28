import React, { useState } from 'react';
import Replicate from "replicate";
import { Loader2, AlertCircle } from 'lucide-react';

interface VideoGeneratorProps {
  setGeneratedVideo: (video: string | null) => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ setGeneratedVideo }) => {
  const [promptStart, setPromptStart] = useState('');
  const [promptEnd, setPromptEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
      
      if (!apiToken) {
        throw new Error('Replicate API token is not configured. Please check your environment variables.');
      }

      const replicate = new Replicate({
        auth: apiToken,
      });

      const input = {
        prompt_start: promptStart,
        prompt_end: promptEnd,
        gif_ping_pong: true,
        output_format: "mp4",
        prompt_strength: 0.9,
        num_animation_frames: "25"
      };

      let videoUrl = null;
      for await (const event of replicate.stream("andreasjansson/stable-diffusion-animation:ca1f5e306e5721e19c473e0d094e6603f0456fe759c10715fcd6c1b79242d4a5", { input })) {
        videoUrl = event;
      }

      if (videoUrl) {
        setGeneratedVideo(videoUrl);
      } else {
        throw new Error('No video URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div>
          <label htmlFor="promptStart" className="block text-sm font-medium text-gray-200 mb-2">
            Start prompt:
          </label>
          <input
            type="text"
            id="promptStart"
            value={promptStart}
            onChange={(e) => setPromptStart(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm 
                     text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter start prompt"
          />
        </div>

        <div>
          <label htmlFor="promptEnd" className="block text-sm font-medium text-gray-200 mb-2">
            End prompt:
          </label>
          <input
            type="text"
            id="promptEnd"
            value={promptEnd}
            onChange={(e) => setPromptEnd(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm 
                     text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter end prompt"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <button
          onClick={generateVideo}
          disabled={loading || !promptStart || !promptEnd}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating...
            </>
          ) : (
            'Generate Video'
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoGenerator;