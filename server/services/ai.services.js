// import OpenAI from "openai";
import Groq from "groq-sdk";

function buildPrompt({ topic, outline }) {
  const lines = [];

  lines.push(`Write a clear, engaging blog post in Markdown.`);

  if (topic) lines.push(`Topic: ${topic}`);
  if (outline) lines.push(`Outline: ${outline}`);

  lines.push(
    `Use headings, short paragraphs, and bullet points where helpful.`
  );

  lines.push(`Return only the blog content (no extra commentary).`);

  return lines.join("\n");
}

export async function generateBlogDraft({ topic = "", outline = "" }) {
  // const apiKey = process.env.OPENAI_API_KEY;

  const apiKey = process.env.GROK_API_KEY;

  const model = process.env.GROK_AI_MODEL || "llama3-70b-8192";

  const prompt = buildPrompt({ topic, outline });

  if (!apiKey) {
    // Mocked content if no API key provided

    return `# ${
      topic || "Untitled Draft"
    }\n\n*This is a mocked AI draft.*\n\n## Introduction\n\nWrite a friendly intro that hooks the reader.\n\n## Main Points\n\n- Key idea one\n- Key idea two\n- Key idea three\n\n## Conclusion\n\nWrap up with a takeaway and a call-to-action.`;
  }

  // const groq = new OpenAI({ apiKey });

  const groq = new Groq({ apiKey });

  // Use the Responses API if available in this SDK version; fall back to chat.completions otherwise

  try {
    // const response = await gr.responses.create({
    //   model,
    //   input: [{ role: "user", content: prompt }],
    // });

    const response = await groq.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
    });

    // console.log(response.choices[0].message.content);

    const text = response?.choices?.[0]?.message?.content?.trim();

    return text || "AI draft could not be generated.";

    // const text = response.output_text || response.content?.[0]?.text || "";
    // return text.trim();
  } catch (err) {
  //   try {
  //     const resp = await client.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: prompt }],
  //       temperature: 0.7,
  //     });
  //     return (
  //       resp.choices?.[0]?.message?.content?.trim() ||
  //       "AI draft could not be generated."
  //     );
  //   } catch (error) {
  //     console.error("OpenAI request failed", error);
  //     return "AI draft could not be generated.";
  //   }
  // }

  console.error("Groq request failed, falling back to OpenAI:", err);

    try {
      const resp = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return (
        resp?.choices?.[0]?.message?.content?.trim() ||
        "AI draft could not be generated."
      );
    } catch (fallbackErr) {
      console.error("Fallback OpenAI request also failed:", fallbackErr);
      return "AI draft could not be generated.";
    }
  }
}
