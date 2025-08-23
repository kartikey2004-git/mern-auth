import { generateBlogDraft } from "../services/ai.services.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const generate = asyncHandler(async (req, res) => {
  const { topic, outline } = req.body;

  const text = await generateBlogDraft({ topic, outline });

  return res
    .status(200)
    .json(new ApiResponse(200, { content: text }, "Draft generated"));
});
