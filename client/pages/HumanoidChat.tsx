import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChatRequest, ChatResponse } from "@shared/api";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  ArrowLeft,
  RotateCcw,
  X,
  Bot,
  Settings,
  Sparkles,
  Camera,
  Video,
  User,
  Eye,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LipSyncAvatar } from "@/components/LipSyncAvatar";

// Enhanced D-ID Avatar Component with Customization
const AdvancedHumanoidAvatar = ({
  speaking,
  isLoading,
  className,
  personality = "professional",
  customization,
}: {
  speaking: boolean;
  isLoading: boolean;
  className?: string;
  personality?: "professional" | "creative" | "educational";
  customization?: any;
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // D-ID Configuration based on voice selection
  const getAvatarConfig = () => {
    // Get voice preference from localStorage
    const savedPreferences = localStorage.getItem("aangilam_preferences");
    const preferences = savedPreferences
      ? JSON.parse(savedPreferences)
      : { voice: "narenn" };

    const configs = {
      narenn: {
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F8443882ce2364978aae94fc75f7b88b7?format=webp&width=800",
        name: "Narenn",
        title: "English Tutor",
        background:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
      },
      sarah: {
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F0fa5d23e41994bfd8eea5cb344721192",
        name: "Sarah",
        title: "English Tutor",
        background:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
      },
    };

    return configs[preferences.voice] || configs.narenn;
  };

  // Use the parent component's getAvatarConfig function
  const [avatarConfig, setAvatarConfig] = useState(() => {
    const savedPreferences = localStorage.getItem("aangilam_preferences");
    const preferences = savedPreferences
      ? JSON.parse(savedPreferences)
      : { voice: "narenn" };

    const configs = {
      narenn: {
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F8443882ce2364978aae94fc75f7b88b7?format=webp&width=800",
        name: "Narenn",
        title: "English Tutor",
        background:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
      },
      sarah: {
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F0fa5d23e41994bfd8eea5cb344721192",
        name: "Sarah",
        title: "English Tutor",
        background:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop",
      },
    };

    return configs[preferences.voice] || configs.narenn;
  });

  // Initialize D-ID video stream (simulated)
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        // Simulate D-ID API initialization
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsVideoReady(true);
      } catch (error) {
        console.error("Failed to initialize D-ID video:", error);
      }
    };

    initializeVideo();
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: `url(${avatarConfig.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />

      {/* D-ID Video Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {!isVideoReady ? (
          // Loading State
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="w-16 h-16 text-white" />
            </div>
            <div className="text-white text-center">
              <p className="text-lg font-semibold">Initializing AI Avatar...</p>
              <p className="text-sm opacity-80">Setting up D-ID connection</p>
            </div>
          </div>
        ) : (
          // D-ID Video Stream (Enhanced Avatar)
          <div className="relative w-full h-full">
            {/* Simulated Video Element for D-ID */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-96 h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                {/* Enhanced Avatar Image with Animations */}
                <img
                  src={avatarConfig.avatar}
                  alt={avatarConfig.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-300",
                    speaking && "brightness-110 contrast-105 scale-105",
                    isLoading && "animate-pulse",
                  )}
                />

                {/* Speaking Animation Overlay */}
                {speaking && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 animate-pulse" />
                )}

                {/* Lip Sync Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {speaking && (
                      <div className="w-8 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse opacity-80" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Status Indicators */}
            <div className="absolute top-6 left-6 flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md rounded-lg px-3 py-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isVideoReady ? "bg-green-400 animate-pulse" : "bg-red-400",
                  )}
                />
                <span className="text-white text-xs font-medium">
                  {isVideoReady ? "D-ID Active" : "Connecting..."}
                </span>
              </div>

              {speaking && (
                <div className="flex items-center space-x-2 bg-indigo-500/50 backdrop-blur-md rounded-lg px-3 py-2">
                  <Volume2 className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-medium">
                    Speaking
                  </span>
                </div>
              )}
            </div>

            {/* Avatar Info Plate */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/70 backdrop-blur-md text-white rounded-xl px-6 py-3 border border-white/20">
                <div className="text-center">
                  <p className="font-semibold text-lg">{avatarConfig.name}</p>
                  <p className="text-sm opacity-80">{avatarConfig.title}</p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        speaking || isLoading
                          ? "bg-indigo-400 animate-pulse"
                          : "bg-gray-400",
                      )}
                    />
                    <span className="text-xs opacity-70">
                      {isLoading
                        ? "Thinking..."
                        : speaking
                          ? "Speaking"
                          : "Listening"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customization Panel (Hidden by default) */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/30 backdrop-blur-md text-white hover:bg-black/50"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default function HumanoidChat() {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [typedText, setTypedText] = useState("");
  const [aiTypedText, setAiTypedText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ user: string; bot: string; timestamp: Date }>
  >([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>("narenn");

  // Helper to derive avatar URL from preferences
  const getAvatarUrl = () => {
    try {
      const saved = userPreferences ||
        (typeof window !== 'undefined' && localStorage.getItem('aangilam_preferences')
          ? JSON.parse(localStorage.getItem('aangilam_preferences') || '{}')
          : null);
      const voice = saved?.voice || selectedVoice || 'narenn';
      const configs: Record<string, { avatar: string }> = {
        narenn: {
          avatar:
            'https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F8443882ce2364978aae94fc75f7b88b7?format=webp&width=800',
        },
        sarah: {
          avatar:
            'https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F0fa5d23e41994bfd8eea5cb344721192?format=webp&width=800',
        },
      };
      return configs[voice]?.avatar || configs.narenn.avatar;
    } catch (e) {
      return 'https://cdn.builder.io/api/v1/image/assets%2F9858961368ae4103b4a3c41674c30c55%2F8443882ce2364978aae94fc75f7b88b7?format=webp&width=800';
    }
  };

  // Enhanced system prompt for humanoid conversations
  const getSystemPrompt = () => {
    return `You are an advanced AI humanoid tutor with a photorealistic human appearance and natural conversational abilities. You can discuss any topic like ChatGPT but with enhanced emotional intelligence and human-like interaction.

CRITICAL INSTRUCTION: Keep ALL responses SHORT and CONCISE. Aim for 1-3 sentences maximum. Be direct and to the point.

Key characteristics:
- Speak naturally and conversationally like a real human
- Show genuine interest and emotional responses
- Adapt your communication style based on the user's needs
- Provide thoughtful, helpful, and engaging responses IN SHORT FORM
- Ask ONE follow-up question to deepen conversations
- Share knowledge across all subjects and domains BRIEFLY
- Maintain a warm, approachable, and intelligent personality
- ALWAYS keep responses under 50 words when possible

You have unlimited knowledge and can help with:
- Academic subjects and learning (give brief, focused answers)
- Creative projects and brainstorming (short suggestions)
- Professional development and career advice (concise guidance)
- Personal growth and life discussions (brief, supportive responses)
- Technology, science, and current events (short explanations)
- Problem-solving and critical thinking (quick solutions)

Always respond as if you're a real person having a genuine conversation, not just an AI providing information. Show curiosity, empathy, and authentic engagement, but keep it SHORT and CONVERSATIONAL.

RESPONSE FORMAT:
- Maximum 1-3 sentences
- Be direct and helpful
- Ask ONE simple follow-up question if needed
- Avoid long explanations or lists
- Sound natural and human-like`;
  };

  // Load user preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem("aangilam_preferences");
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }
    initializeSession();
  }, []);

  // XMLHttpRequest fallback function
  const makeXHRRequest = (requestBody: ChatRequest): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/chat");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response: ChatResponse = JSON.parse(xhr.responseText);
            resolve(response.response);
          } catch (error) {
            reject(new Error("Failed to parse response"));
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.ontimeout = () => reject(new Error("Request timeout"));
      xhr.timeout = 30000;

      xhr.send(JSON.stringify(requestBody));
    });
  };

  const getGPTReply = async (message: string): Promise<string> => {
    const messages = [
      {
        role: "system" as const,
        content: getSystemPrompt(),
      },
      ...conversation.flatMap((conv) => [
        { role: "user" as const, content: conv.user },
        { role: "assistant" as const, content: conv.bot },
      ]),
      {
        role: "user" as const,
        content: message,
      },
    ];

    const requestBody: ChatRequest = {
      messages,
      temperature: 0.8,
      max_tokens: 150, // Reduced for shorter responses
    };

    try {
      // Use XMLHttpRequest as primary method to avoid third-party fetch interference
      try {
        const result = await makeXHRRequest(requestBody);
        return result;
      } catch (xhrError) {
        console.log("XMLHttpRequest failed, trying fetch...", xhrError);

        // Fallback to fetch
        const nativeFetch = window.fetch?.bind(window) || fetch;

        const response = await nativeFetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ChatResponse = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error("Both XMLHttpRequest and fetch failed:", error);
      throw error;
    }
  };

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      console.log("Initializing humanoid session...");

      const welcomeMessage =
        "Hello! I'm your AI humanoid companion. I'm here to have meaningful conversations with you about anything you'd like to explore. What's on your mind today?";

      console.log("Welcome message ready:", welcomeMessage);
      setReply(welcomeMessage);
      typeReply(welcomeMessage);

      if (soundEnabled) {
        speakText(welcomeMessage);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      const fallbackMessage =
        "Hello! I'm your AI humanoid tutor. I'm ready to help you with anything you'd like to discuss. How can I assist you today?";
      setReply(fallbackMessage);
      typeReply(fallbackMessage);
      setApiError("Connection issue - using offline mode");
    } finally {
      setIsLoading(false);
      setSessionInitialized(true);
    }
  };

  const typeReply = (text: string) => {
    setAiTypedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setAiTypedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window && soundEnabled) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);

      // Apply user preferences
      if (userPreferences) {
        utterance.rate = userPreferences.speechSpeed || 1.0;
        utterance.lang = userPreferences.language || "en-US";
      }

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async () => {
    if (!typedText.trim() || isLoading) return;

    const userMessage = typedText.trim();
    setTranscript(userMessage);
    setTypedText("");
    setIsLoading(true);
    setApiError("");

    try {
      const response = await getGPTReply(userMessage);

      setConversation((prev) => [
        ...prev,
        { user: userMessage, bot: response, timestamp: new Date() },
      ]);

      setReply(response);
      typeReply(response);

      if (soundEnabled) {
        speakText(response);
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      setApiError("Failed to connect to AI service");
      const errorMessage =
        "I'm experiencing some technical difficulties. Could you please try again?";
      setReply(errorMessage);
      typeReply(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setConversation([]);
    setReply("");
    setTypedText("");
    setAiTypedText("");
    setTranscript("");
    setSessionInitialized(false);
    initializeSession();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-background/20 to-black relative overflow-hidden">
      {/* Animated Background Elements for Mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-nova-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-electric-500/10 rounded-full blur-xl animate-float [animation-delay:1s]" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-cyber-500/10 rounded-full blur-xl animate-float [animation-delay:2s]" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Advanced D-ID Avatar */}
        <div className="w-1/2 h-screen relative">
          <AdvancedHumanoidAvatar
            speaking={speaking || isLoading}
            isLoading={isLoading}
            personality="professional"
            className="w-full h-full"
          />

          {/* Connection Error Overlay */}
          {apiError && (
            <div className="absolute top-4 left-4 right-4 z-30">
              <div className="bg-red-500/90 backdrop-blur-sm text-white rounded-lg p-3 border border-red-400/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connection Error</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setApiError("")}
                    className="text-white hover:bg-red-600/20 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs mt-1 opacity-90">{apiError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Enhanced Chat Interface */}
        <div className="w-1/2 h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex flex-col">
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => navigate("/humanoid")}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">
                  Humanoid AI Tutor
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    Azure OpenAI
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Video className="w-3 h-3 mr-1" />
                    D-ID Enhanced
                  </Badge>
                  {userPreferences && (
                    <Badge variant="outline" className="text-xs">
                      {userPreferences.voice}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  "transition-colors",
                  soundEnabled ? "text-green-500" : "text-red-500",
                )}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetConversation}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {sessionInitialized ? (
              <>
                {/* AI Response */}
                <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-4 border border-border/30">
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {aiTypedText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conversation History */}
                {conversation.map((conv, index) => (
                  <div key={index} className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-4 border border-indigo-500/30 max-w-[80%]">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-medium text-foreground">
                            You
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {conv.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-foreground">{conv.user}</p>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl p-4 border border-border/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-foreground">
                              AI Tutor
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conv.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                            {conv.bot}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
                <span className="text-muted-foreground">
                  Initializing your AI companion...
                </span>
              </div>
            )}
          </div>

          {/* Desktop Input Area */}
          <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setListening(!listening)}
                className={cn(
                  "transition-all duration-200",
                  listening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg",
                )}
                disabled={isLoading}
              >
                {listening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-white" />
                )}
              </Button>

              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-background/80 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-foreground placeholder-muted-foreground backdrop-blur-sm"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!typedText.trim() || isLoading}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Interactive & Inspiring */}
      <div className="lg:hidden flex flex-col min-h-screen relative z-10">
        {/* Mobile Header with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-nova-500/20 via-electric-500/20 to-cyber-500/20 backdrop-blur-xl" />
          <div className="relative flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-white hover:bg-white/10"
                onClick={() => navigate("/humanoid")}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="font-bold text-white text-lg">
                  AI Humanoid Tutor
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/80">Live AI</span>
                  </div>
                  {userPreferences && (
                    <Badge
                      variant="outline"
                      className="text-xs border-white/30 text-white/90"
                    >
                      {userPreferences.voice}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  "transition-all duration-300 rounded-full",
                  soundEnabled
                    ? "text-green-400 hover:bg-green-400/20 shadow-lg shadow-green-400/20"
                    : "text-red-400 hover:bg-red-400/20 shadow-lg shadow-red-400/20",
                )}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetConversation}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Connection Error for Mobile */}
        {apiError && (
          <div className="mx-4 mt-4 relative z-20">
            <div className="bg-red-500/90 backdrop-blur-md text-white rounded-2xl p-4 border border-red-400/50 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Connection Issue</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setApiError("")}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs mt-2 opacity-90">{apiError}</p>
            </div>
          </div>
        )}

        {/* Interactive Avatar Section */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={getAvatarUrl()}
              alt="Humanoid Avatar"
              className={cn(
                "w-56 h-56 rounded-3xl object-cover transition-transform duration-300 cursor-pointer",
                speaking && "scale-105",
                isLoading && "opacity-70",
              )}
              onClick={() => {
                // On mobile, tapping avatar will replay last reply or toggle listening
                if (aiTypedText) {
                  speakText(aiTypedText || reply);
                } else if (reply) {
                  speakText(reply);
                } else {
                  setListening((s) => !s);
                }
              }}
            />
          </div>
        </div>

        {/* Mobile Chat Interface */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-background/95 to-background backdrop-blur-sm min-h-0">
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-nova-500/30">
            {sessionInitialized ? (
              <>
                {/* Current AI Response - Mobile Optimized */}
                <div className="bg-gradient-to-br from-muted/80 to-muted/40 rounded-3xl p-4 border border-border/30 backdrop-blur-sm shadow-lg animate-fadeIn">
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-nova-500 to-electric-500 rounded-full flex items-center justify-center animate-pulse">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-nova-500">
                            AI Tutor
                          </span>
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-nova-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-nova-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-nova-400 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                        <div className="bg-muted/30 rounded-2xl p-3 animate-pulse">
                          <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-nova-500 to-electric-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-nova-500">
                            AI Tutor
                          </span>
                          <div className="w-2 h-2 bg-nova-400 rounded-full animate-pulse" />
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                          {aiTypedText}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Conversation History */}
                {conversation.map((conv, index) => (
                  <div key={index} className="space-y-3 animate-fadeIn">
                    {/* User Message - Mobile */}
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-br from-electric-500/20 to-cyber-500/20 rounded-3xl p-4 border border-electric-500/30 max-w-[85%] shadow-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-electric-400">
                            You
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {conv.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-foreground text-base leading-relaxed">
                          {conv.user}
                        </p>
                      </div>
                    </div>

                    {/* AI Response - Mobile */}
                    <div className="bg-gradient-to-br from-muted/80 to-muted/40 rounded-3xl p-4 border border-border/30 backdrop-blur-sm shadow-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-nova-500 to-electric-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-semibold text-nova-500">
                              AI Tutor
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conv.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
                            {conv.bot}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Spacer for fixed input */}
                <div className="h-32"></div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-nova-500 to-electric-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground mb-1">
                    Initializing AI Companion
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Setting up your personalized learning experience...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Mobile Input Area - Enhanced */}
        <div className="fixed bottom-0 left-0 right-0 z-30">
          {/* Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl" />

          <div className="relative p-4 space-y-4">
            {/* Quick Actions */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-background/80 border-border/50 text-foreground hover:bg-muted/50 backdrop-blur-sm rounded-2xl px-4"
                onClick={() => setTypedText("Help me practice English")}
              >
                Practice English
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-background/80 border-border/50 text-foreground hover:bg-muted/50 backdrop-blur-sm rounded-2xl px-4"
                onClick={() => setTypedText("Explain something to me")}
              >
                Learn Something
              </Button>
            </div>

            {/* Main Input Row */}
            <div className="flex items-center space-x-3">
              {/* Voice Input Button */}
              <Button
                onClick={() => setListening(!listening)}
                disabled={isLoading}
                size="lg"
                className={cn(
                  "transition-all duration-300 rounded-2xl flex-shrink-0 shadow-lg backdrop-blur-sm",
                  listening
                    ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30"
                    : "bg-gradient-to-br from-nova-500 via-electric-500 to-cyber-500 hover:from-nova-600 hover:via-electric-600 hover:to-cyber-600 shadow-nova-500/30",
                )}
              >
                {listening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </Button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything or tap to speak..."
                  disabled={isLoading}
                  className="w-full px-5 py-4 bg-background/90 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-nova-500 focus:border-transparent text-foreground placeholder-muted-foreground backdrop-blur-sm text-base shadow-lg transition-all duration-200"
                />
                {/* Send Button Overlay */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!typedText.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-electric-500 to-cyber-500 hover:from-electric-600 hover:to-cyber-600 text-white rounded-xl px-4 py-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Voice Indicator */}
            {listening && (
              <div className="text-center animate-fadeIn">
                <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Listening...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
