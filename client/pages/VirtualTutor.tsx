import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Send,
  Play,
  Square,
  Sparkles,
  MessageSquare,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
} from "lucide-react";

declare global {
  interface Window {
    didAgent?: {
      startConversation: () => Promise<void>;
      sendMessage: (text: string) => Promise<void>;
    };
  }
}

const containerId = "avatar-container";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

export default function VirtualTutor() {
  const [isAgentReady, setIsAgentReady] = useState(false);
  const [isConversing, setIsConversing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    const existing = document.querySelector(
      `script[src="https://agent.d-id.com/v2/index.js"]`,
    );
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://agent.d-id.com/v2/index.js";
    script.dataset.mode = "full";
    script.dataset.clientKey =
      "Z29vZ2xlLW9hdXRoMnwxMTY0ODc5MTc0ODcwOTE0MjY4ODU6U0VGX0RTOGxrVFFsNUtkTm1RU1dH";
    script.dataset.agentId = "v2_agt_xbPqAw6G";
    script.dataset.targetId = containerId;

    document.body.appendChild(script);

    // Poll for readiness
    pollRef.current = window.setInterval(() => {
      if (window.didAgent) {
        setIsAgentReady(true);
        if (pollRef.current) window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 300);

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
      script.remove();
    };
  }, []);

  // Load user preferences (same storage as Humanoid Chat)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aangilam_preferences");
      if (saved) setUserPreferences(JSON.parse(saved));
    } catch {}
  }, []);

  // Apply mute/volume to media inside the avatar container
  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const media = root.querySelectorAll<HTMLMediaElement>("video, audio");
    media.forEach((m) => {
      try {
        m.muted = !soundEnabled || muted;
        if (soundEnabled && !muted) m.volume = 1;
      } catch {}
    });
  }, [soundEnabled, muted, isAgentReady]);

  const quickPrompts = useMemo(
    () => [
      "Help me practice greetings",
      "Correct my pronunciation",
      "Explain this grammar rule",
      "Give me a vocabulary quiz",
      "Role-play a restaurant scene",
    ],
    [],
  );

  const startConversation = useCallback(async () => {
    const agent = window.didAgent;
    if (!agent) {
      toast({
        title: "Agent not ready",
        description: "Please wait a moment.",
        variant: "destructive",
      });
      return;
    }
    try {
      await agent.startConversation();
      setIsConversing(true);
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Voice session started. You can speak to your tutor now.",
        },
      ]);
    } catch (e) {
      toast({
        title: "Could not start conversation",
        description: String(e),
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopConversation = useCallback(() => {
    // D-ID SDK handles end-of-utterance; we provide a UX stop state.
    setIsConversing(false);
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Voice session stopped.",
      },
    ]);
  }, []);

  const toggleSound = useCallback(() => setSoundEnabled((s) => !s), []);

  const toggleListening = useCallback(async () => {
    if (!listening) {
      await startConversation();
      setListening(true);
    } else {
      setListening(false);
      setIsConversing(false);
    }
  }, [listening, startConversation]);

  const resetConversation = useCallback(() => {
    setIsConversing(false);
    setListening(false);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Conversation reset.",
      },
    ]);
  }, []);

  const sendText = useCallback(
    async (text?: string) => {
      const agent = window.didAgent;
      const content = (text ?? input).trim();
      if (!content) return;
      if (!agent) {
        toast({
          title: "Agent not ready",
          description: "Please wait a moment.",
          variant: "destructive",
        });
        return;
      }
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "user", text: content },
      ]);
      setInput("");
      try {
        await agent.sendMessage(content);
        // We optimistically show that the tutor is responding
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: "Responding… check the avatar for the spoken answer.",
          },
        ]);
      } catch (e) {
        toast({
          title: "Send failed",
          description: String(e),
          variant: "destructive",
        });
      }
    },
    [input, toast],
  );

  return (
    <div className="virtual-tutor-page min-h-[calc(100vh-4rem)] w-full px-4 py-8 md:px-8 lg:px-12 bg-white">
      <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-2">
        {/* Avatar panel */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold">
                  Human Tutor
                </CardTitle>
                <CardDescription>
                  Practice speaking with real-time feedback
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant={muted ? "secondary" : "outline"}
                  aria-label={muted ? "Unmute" : "Mute"}
                  onClick={() => setMuted((m) => !m)}
                >
                  {muted ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </Button>
                {!isConversing ? (
                  <Button
                    onClick={startConversation}
                    disabled={!isAgentReady}
                    className="gap-2"
                  >
                    <Play className="size-4" /> Start Chat
                  </Button>
                ) : (
                  <Button
                    onClick={stopConversation}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="size-4" /> Stop
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/5] w-full overflow-hidden rounded-xl border bg-white relative">
              <div id={containerId} className="absolute inset-0" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur-md border">
                <span
                  className={
                    "size-2 rounded-full " +
                    (isAgentReady ? "bg-green-500" : "bg-muted")
                  }
                ></span>
                <span>{isAgentReady ? "Ready" : "Loading…"}</span>
              </div>
              <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="shadow-md"
                  title="Push-to-talk"
                  onClick={startConversation}
                  disabled={!isAgentReady}
                >
                  <Mic className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter />
        </Card>

        {/* Chat panel */}
        <Card className="h-full flex flex-col -ml-px">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-primary" />
                <div>
                  <CardTitle>Conversation</CardTitle>
                  <CardDescription>
                    Type to chat with your tutor. Spoken replies play on the
                    left.
                    {userPreferences && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        • {userPreferences.voice} • {userPreferences.language} •{" "}
                        {userPreferences.speechSpeed}x
                      </span>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSound}
                  title={soundEnabled ? "Sound on" : "Sound off"}
                  className={soundEnabled ? "text-green-600" : "text-red-600"}
                >
                  {soundEnabled ? (
                    <Volume2 className="size-4" />
                  ) : (
                    <VolumeX className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleListening}
                  title={listening ? "Stop listening" : "Start listening"}
                >
                  {listening ? (
                    <MicOff className="size-4" />
                  ) : (
                    <Mic className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetConversation}
                  title="Reset conversation"
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 overflow-y-auto space-y-3 max-h-[60vh] pr-1">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-12">
                Start a conversation or use a quick prompt to begin.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    "flex items-start gap-3 " +
                    (m.role === "user" ? "justify-end" : "justify-start")
                  }
                >
                  {m.role === "assistant" && (
                    <div className="mt-1 size-6 shrink-0 rounded-full bg-nova-500/20 text-nova-700 dark:text-nova-200 flex items-center justify-center">
                      <MessageSquare className="size-3" />
                    </div>
                  )}
                  <div
                    className={
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm " +
                      (m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground")
                    }
                  >
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <div className="mt-1 size-6 shrink-0 rounded-full bg-electric-500/20 text-electric-700 dark:text-electric-200 flex items-center justify-center">
                      <span className="text-[10px] font-bold">You</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="mt-24">
            <form
              className="flex w-full items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendText();
              }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-12 h-12 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendText();
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!isAgentReady || input.trim().length === 0}
                className="gap-2"
              >
                <Send className="size-4" /> Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
