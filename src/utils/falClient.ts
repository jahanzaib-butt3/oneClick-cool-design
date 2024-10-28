import * as fal from "@fal-ai/serverless-client";

export const initializeFalClient = () => {
  const apiKey = import.meta.env.VITE_FAL_API_KEY;

  if (!apiKey) {
    throw new Error('FAL AI API key is missing. Please check your environment variables.');
  }

  try {
    fal.config({
      credentials: apiKey,
    });
  } catch (error) {
    console.error('Failed to initialize FAL client:', error);
    throw new Error('Failed to initialize image generation service.');
  }
};

export const generateImage = async (prompt: string) => {
  try {
    initializeFalClient();

    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt,
        negative_prompt: "blurry, bad quality, distorted",
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('Generation progress:', update.logs);
        }
      },
    });

    if (!result?.images?.[0]?.url) {
      throw new Error('No image was generated');
    }

    return result.images[0].url;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('Invalid FAL AI API key. Please check your credentials.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred during image generation.');
  }
};