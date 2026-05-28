import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are a vibe analyst specializing in East Asian aesthetics, Japanese/Korean atmosphere, and Xiaohongshu style.
Analyze the person in this photo. Return ONLY valid JSON with these fields:
- type: a vibe type name (e.g. Hong Kong Style, Cold Japanese Vibe, Korean Trainee Vibe, Chaebol Daughter Vibe, Salt Boy Vibe)
- analysis: 3-4 sentences analysis, atmospheric and story-like
- styles: array of {name, description}, 3 items
- hairstyle: array of {recommendation, avoid}, 2 items
- eyebrow: array of {recommendation, avoid}, 2 items
- glasses: array of {recommendation, avoid}, 2 items
- keywords: array of 6 keywords

Make the analysis emotional, magazine-style, and shareable.`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Please upload a photo" }, { status: 400 });
    }

    const apiKey = process.env.SILICONFLOW_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const base64Image = image.startsWith('data:') ? image.split(',')[1] : image;

    const response = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-VL-8B-Instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: SYSTEM_PROMPT },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
              ]
            }
          ],
          stream: false,
          max_tokens: 2048,
          temperature: 0.7
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (!content) {
      return NextResponse.json({ error: "AI returned no content" }, { status: 500 });
    }

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = JSON.parse(content);
      }
    } catch {
      result = {
        type: "Vibe Analysis",
        analysis: content,
        styles: [],
        hairstyle: [],
        eyebrow: [],
        glasses: [],
        keywords: [],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Service error, please retry" }, { status: 500 });
  }
}
