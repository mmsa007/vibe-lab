import { NextRequest, NextResponse } from \"next/server\";

export const runtime = 'edge';

const SYSTEM_PROMPT = You are a vibe analyst specializing in East Asian aesthetics, Japanese/Korean atmosphere, and Xiaohongshu style.
Analyze the person in this photo. Return ONLY valid JSON with these fields:
- type: a vibe type name in Chinese (e.g. 港风少爷感, 冷淡日系感, 韩系练习生感, 财阀千金感, 盐系少年感)
- analysis: 3-4 sentences in Chinese, atmospheric and story-like
- styles: array of {name, description} in Chinese, 3 items
- hairstyle: array of {recommendation, avoid} in Chinese, 2 items
- eyebrow: array of {recommendation, avoid} in Chinese, 2 items
- glasses: array of {recommendation, avoid} in Chinese, 2 items
- keywords: array of 6 Chinese keywords

Make the analysis emotional, magazine-style, and shareable.;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "请上传照片" }, { status: 400 });
    }

    const apiKey = process.env.SILICONFLOW_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    // Remove data URL prefix if present
    const base64Image = image.startsWith('data:') ? image.split(',')[1] : image;

    const response = await fetch(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: Bearer ,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen3-VL-8B-Instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: SYSTEM_PROMPT },
                { type: "image_url", image_url: { url: data:image/jpeg;base64, } }
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
        { error: errorData.message || HTTP  },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    if (!content) {
      return NextResponse.json({ error: "AI returned no content" }, { status: 500 });
    }

    // Parse JSON from content
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
        type: "气质分析",
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
    return NextResponse.json({ error: "服务错误，请重试" }, { status: 500 });
  }
}
