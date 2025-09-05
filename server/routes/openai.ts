import { RequestHandler } from "express";
import { ChatRequest, ChatResponse } from "@shared/api";

// Generate intelligent fallback responses based on context
const generateFallbackResponse = (
  messages: Array<{ role: string; content: string }>,
): string => {
  const lastMessage =
    messages[messages.length - 1]?.content?.toLowerCase() || "";
  const systemPrompt =
    messages.find((m) => m.role === "system")?.content?.toLowerCase() || "";

  // Detect scenario type from system prompt
  if (systemPrompt.includes("interview")) {
    if (
      lastMessage.includes("tell me about yourself") ||
      lastMessage.includes("introduce")
    ) {
      return "Thank you for that introduction. Can you walk me through your experience with software development? What programming languages are you most comfortable with?";
    } else if (lastMessage.includes("hello") || lastMessage.includes("start")) {
      return "Hello! I'm excited to speak with you today. Let's start with a simple question - could you tell me a bit about yourself and what interests you about this position?";
    } else {
      return "That's interesting. Can you give me a specific example of how you've applied those skills in a real project? What challenges did you face and how did you overcome them?";
    }
  } else if (
    systemPrompt.includes("restaurant") ||
    systemPrompt.includes("dining")
  ) {
    if (lastMessage.includes("hello") || lastMessage.includes("start")) {
      return "Welcome to our restaurant! I'm your server today. Would you like to start with something to drink, or would you prefer to see our menu first?";
    } else if (lastMessage.includes("menu")) {
      return "Absolutely! Today we have some wonderful specials. Our chef recommends the grilled salmon with seasonal vegetables, or if you prefer something heartier, our beef tenderloin is quite popular. What kind of cuisine are you in the mood for?";
    } else {
      return "Excellent choice! Would you like that prepared in any particular way? And can I suggest a wine pairing that would complement your meal perfectly?";
    }
  } else if (
    systemPrompt.includes("shopping") ||
    systemPrompt.includes("store")
  ) {
    if (lastMessage.includes("hello") || lastMessage.includes("start")) {
      return "Hello! Welcome to our store. I'm here to help you find exactly what you're looking for today. What brings you in - are you shopping for anything specific?";
    } else {
      return "Great! I can definitely help you with that. Let me show you some options that might work perfectly for what you need. What's your budget range, and do you have any particular preferences?";
    }
  } else if (
    systemPrompt.includes("grammar") ||
    systemPrompt.includes("tutor")
  ) {
    if (lastMessage.includes("hello") || lastMessage.includes("start")) {
      return "Hello! I'm your English grammar tutor. I'm here to help you improve your language skills. What would you like to work on today - grammar rules, sentence structure, or perhaps vocabulary?";
    } else {
      return "That's a good question! Let me explain that clearly. Remember, practice makes perfect, so don't worry about making mistakes - that's how we learn!";
    }
  } else {
    // Generic responses
    if (lastMessage.includes("hello") || lastMessage.includes("start")) {
      return "Hello! I'm ready to help you practice. How would you like to begin our conversation today?";
    } else {
      return "That's very interesting! Could you tell me more about that? I'd love to hear your thoughts and continue our conversation.";
    }
  }
};

export const handleChat: RequestHandler = async (req, res) => {
  const startTime = Date.now();

  try {
    console.log("=== CHAT API REQUEST START ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Request method:", req.method);
    console.log("Request body keys:", Object.keys(req.body || {}));

    // Validate request method
    if (req.method !== "POST") {
      console.error("Invalid method:", req.method);
      return res.status(405).json({
        success: false,
        error: "Method not allowed. Use POST.",
        response: "Invalid request method.",
      } as ChatResponse);
    }

    // Validate request body exists
    if (!req.body) {
      console.error("Request body is missing");
      return res.status(400).json({
        success: false,
        error: "Request body is required",
        response: "Please provide a valid request body.",
      } as ChatResponse);
    }

    // Extract and validate request data
    let messages: any, temperature: number, max_tokens: number;

    try {
      const extracted = req.body as ChatRequest;
      messages = extracted.messages;
      temperature = extracted.temperature ?? 0.7;
      max_tokens = extracted.max_tokens ?? 800;

      console.log("Extracted parameters:", {
        messagesCount: Array.isArray(messages) ? messages.length : "not array",
        temperature,
        max_tokens,
      });
    } catch (extractError) {
      console.error("Error extracting request parameters:", extractError);
      return res.status(400).json({
        success: false,
        error: "Invalid request format",
        response: "Request body format is invalid.",
      } as ChatResponse);
    }

    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      console.error("Messages is not an array:", typeof messages, messages);
      return res.status(400).json({
        success: false,
        error: "Messages must be an array",
        response: "Please provide a valid messages array.",
      } as ChatResponse);
    }

    if (messages.length === 0) {
      console.error("Messages array is empty");
      return res.status(400).json({
        success: false,
        error: "Messages array cannot be empty",
        response: "Please provide at least one message.",
      } as ChatResponse);
    }

    // Validate each message structure
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (!message.role || !message.content) {
        console.error(`Invalid message at index ${i}:`, message);
        return res.status(400).json({
          success: false,
          error: `Message at index ${i} is missing role or content`,
          response: "All messages must have role and content.",
        } as ChatResponse);
      }

      if (!["system", "user", "assistant"].includes(message.role)) {
        console.error(`Invalid role at index ${i}:`, message.role);
        return res.status(400).json({
          success: false,
          error: `Invalid role "${message.role}" at message ${i}. Must be system, user, or assistant.`,
          response: "Message role must be system, user, or assistant.",
        } as ChatResponse);
      }
    }

    // Validate temperature and max_tokens
    if (typeof temperature !== "number" || temperature < 0 || temperature > 2) {
      console.error("Invalid temperature:", temperature);
      return res.status(400).json({
        success: false,
        error: "Temperature must be a number between 0 and 2",
        response: "Invalid temperature parameter.",
      } as ChatResponse);
    }

    if (typeof max_tokens !== "number" || max_tokens < 1 || max_tokens > 4000) {
      console.error("Invalid max_tokens:", max_tokens);
      return res.status(400).json({
        success: false,
        error: "max_tokens must be a number between 1 and 4000",
        response: "Invalid max_tokens parameter.",
      } as ChatResponse);
    }

    // AI Service configuration with fallback options
    const azureApiKey =
      process.env.AZURE_OPENAI_API_KEY ||
      "EVAHs6G6shOqjtjtybO8KWFQxbuPdTM4ilgmUX5WidXOqnYS865sJQQJ99BHACYeBjFXJ3w3AAABACOGwoQO";

    const azureEndpoint =
      process.env.AZURE_OPENAI_ENDPOINT ||
      "https://angilambot-api.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview";

    // Alternative OpenAI configuration
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openaiEndpoint = "https://api.openai.com/v1/chat/completions";

    // Check for demo mode
    const isDemoMode =
      process.env.DEMO_MODE === "true" ||
      (!azureApiKey && !openaiApiKey);

    // If in demo mode, immediately return fallback response
    if (isDemoMode) {
      console.log("Running in demo mode - using fallback responses");
      const fallbackResponse = generateFallbackResponse(messages);
      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        fallback: true,
        note: "Running in demo mode - using smart responses",
      } as ChatResponse);
    }

    // Determine which service to use
    const useAzure = azureApiKey && !process.env.FORCE_OPENAI;
    const useOpenAI = openaiApiKey && (!useAzure || process.env.FORCE_OPENAI);

    if (!useAzure && !useOpenAI) {
      console.log("No AI service configured - using fallback responses");
      const fallbackResponse = generateFallbackResponse(messages);
      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        fallback: true,
        note: "AI service not configured - using smart responses",
      } as ChatResponse);
    }

    console.log("=== AI SERVICE REQUEST ===");
    console.log("Using service:", useAzure ? "Azure OpenAI" : "OpenAI");
    console.log("Endpoint:", useAzure ? azureEndpoint : openaiEndpoint);
    console.log("API Key present:", !!(useAzure ? azureApiKey : openaiApiKey));
    console.log(
      "Request payload:",
      JSON.stringify(
        {
          messages,
          temperature,
          max_tokens,
        },
        null,
        2,
      ),
    );

    // Prepare headers and payload based on service
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    let requestPayload: any = {
      messages,
      temperature,
      max_tokens,
    };

    if (useAzure) {
      headers["api-key"] = azureApiKey;
    } else {
      headers["Authorization"] = `Bearer ${openaiApiKey}`;
      requestPayload.model = "gpt-3.5-turbo"; // Add model for OpenAI
    }

    // Try primary service first
    let response: Response;
    let usedFallback = false;

    try {
      const endpoint = useAzure ? azureEndpoint : openaiEndpoint;
      console.log("Attempting primary service:", useAzure ? "Azure" : "OpenAI");

      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(requestPayload),
      });

      console.log("Primary service response status:", response.status);
      console.log(
        "Primary service response headers:",
        JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2),
      );

      // If primary service fails with auth error, try fallback
      if (
        !response.ok &&
        (response.status === 401 || response.status === 403)
      ) {
        console.log("Primary service auth failed, attempting fallback...");

        if (useAzure && openaiApiKey) {
          console.log("Falling back to OpenAI...");
          usedFallback = true;

          response = await fetch(openaiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              ...requestPayload,
              model: "gpt-3.5-turbo",
            }),
          });

          console.log("Fallback OpenAI response status:", response.status);
        } else if (!useAzure && azureApiKey) {
          console.log("Falling back to Azure...");
          usedFallback = true;

          response = await fetch(azureEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": azureApiKey,
            },
            body: JSON.stringify({
              messages,
              temperature,
              max_tokens,
            }),
          });

          console.log("Fallback Azure response status:", response.status);
        }
      }
    } catch (fetchError) {
      console.error("=== FETCH ERROR ===");
      console.error("Fetch failed:", fetchError);
      console.error("Error type:", typeof fetchError);
      console.error(
        "Error name:",
        fetchError instanceof Error ? fetchError.name : "unknown",
      );
      console.error(
        "Error message:",
        fetchError instanceof Error ? fetchError.message : "unknown",
      );

      // Return smart fallback response based on scenario
      const fallbackResponse = generateFallbackResponse(messages);

      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        fallback: true,
      } as ChatResponse);
    }

    // Handle non-200 responses
    if (!response.ok) {
      let errorDetails: string;
      let errorBody: any;

      try {
        const errorText = await response.text();
        errorDetails = errorText;

        // Try to parse as JSON for more details
        try {
          errorBody = JSON.parse(errorText);
        } catch {
          errorBody = { raw: errorText };
        }
      } catch (textError) {
        console.error("Error reading response text:", textError);
        errorDetails = "Could not read error response";
        errorBody = {};
      }

      console.error("=== AZURE API ERROR ===");
      console.error("Status:", response.status);
      console.error("Status text:", response.statusText);
      console.error("Error body:", errorBody);
      console.error("Error details:", errorDetails);

      // Handle specific error cases with smart fallbacks
      const serviceName = usedFallback
        ? useAzure
          ? "OpenAI"
          : "Azure"
        : useAzure
          ? "Azure"
          : "OpenAI";

      if (response.status === 401 || response.status === 403) {
        console.log(
          `${serviceName} authentication failed, using fallback response`,
        );
        const fallbackResponse = generateFallbackResponse(messages);
        return res.status(200).json({
          success: true,
          response: fallbackResponse,
          fallback: true,
          note: "AI service temporarily unavailable - using smart response",
        } as ChatResponse);
      } else if (response.status === 429) {
        const fallbackResponse = generateFallbackResponse(messages);
        return res.status(200).json({
          success: true,
          response: fallbackResponse,
          fallback: true,
          note: "Service busy - using smart response",
        } as ChatResponse);
      } else if (response.status >= 500) {
        const fallbackResponse = generateFallbackResponse(messages);
        return res.status(200).json({
          success: true,
          response: fallbackResponse,
          fallback: true,
          note: "Service temporarily unavailable - using smart response",
        } as ChatResponse);
      } else {
        const fallbackResponse = generateFallbackResponse(messages);
        return res.status(200).json({
          success: true,
          response: fallbackResponse,
          fallback: true,
          note: "Service error - using smart response",
        } as ChatResponse);
      }
    }

    // Parse successful response
    let data: any;
    try {
      data = await response.json();
      console.log("=== AZURE RESPONSE SUCCESS ===");
      console.log("Response data:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error("=== JSON PARSE ERROR ===");
      console.error("Error parsing Azure response JSON:", parseError);
      return res.status(500).json({
        success: false,
        error: "Invalid response format from Azure OpenAI",
        response: "Service returned invalid data. Please try again.",
      } as ChatResponse);
    }

    // Extract chat response
    const chatResponse = data.choices?.[0]?.message?.content;

    if (!chatResponse) {
      console.error("=== MISSING RESPONSE CONTENT ===");
      console.error(
        "Service response structure:",
        JSON.stringify(data, null, 2),
      );
      const fallbackResponse = generateFallbackResponse(messages);
      return res.status(200).json({
        success: true,
        response: fallbackResponse,
        fallback: true,
        note: "Service returned empty response - using smart response",
      } as ChatResponse);
    }

    // Success response
    const responseData: ChatResponse = {
      success: true,
      response: chatResponse.trim(),
    };

    const endTime = Date.now();
    console.log("=== CHAT API SUCCESS ===");
    console.log("Response data:", responseData);
    console.log("Processing time:", endTime - startTime, "ms");
    console.log("=== CHAT API REQUEST END ===");

    return res.status(200).json(responseData);
  } catch (error) {
    const endTime = Date.now();

    console.error("=== UNHANDLED ERROR IN CHAT API ===");
    console.error("Processing time:", endTime - startTime, "ms");
    console.error("Error type:", typeof error);
    console.error("Error constructor:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    console.error("Full error object:", error);
    console.error("Request details:", {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });

    // Extract meaningful error message
    let errorMessage = "Unknown server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object") {
      errorMessage = JSON.stringify(error);
    }

    return res.status(500).json({
      success: false,
      error: `Server error: ${errorMessage}`,
      response: "An unexpected error occurred. Please try again later.",
    } as ChatResponse);
  }
};
