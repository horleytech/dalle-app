import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024"
    });

    const imageUrl = response.data.data[0].url;
    return res.status(200).json({ image_url: imageUrl });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to generate image" });
  }
}
