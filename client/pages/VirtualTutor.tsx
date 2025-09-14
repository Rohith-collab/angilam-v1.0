import React, { useCallback, useEffect } from "react";

declare global {
  interface Window {
    didAgent?: {
      startConversation: () => Promise<void>;
      sendMessage: (text: string) => Promise<void>;
    };
  }
}

const containerId = "avatar-container";

export default function VirtualTutor() {
  useEffect(() => {
    // Inject D-ID Agent SDK
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://agent.d-id.com/v2/index.js";
    script.dataset.mode = "full";
    script.dataset.clientKey =
      "Z29vZ2xlLW9hdXRoMnwxMTY0ODc5MTc0ODcwOTE0MjY4ODU6U0VGX0RTOGxrVFFsNUtkTm1RU1dH";
    script.dataset.agentId = "v2_agt_xbPqAw6G";
    script.dataset.targetId = containerId;

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const startConversation = useCallback(async () => {
    const agent = window.didAgent;
    if (!agent) {
      alert("Agent not ready yet!");
      return;
    }
    await agent.startConversation();
  }, []);

  const sendMessage = useCallback(async () => {
    const agent = window.didAgent;
    if (!agent) {
      alert("Agent not ready yet!");
      return;
    }
    await agent.sendMessage("Hello, I want to learn English with Angilam.");
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 4rem)",
        background: "#f4f4f9",
      }}
      className="w-full"
    >
      <h1 style={{ marginBottom: 10 }}>Angilam AI Tutor</h1>

      <div
        id={containerId}
        style={{
          width: 400,
          height: 500,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          marginBottom: 20,
          background: "#000",
        }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={startConversation}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            background: "#007bff",
            color: "white",
            fontSize: 14,
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
        >
          Start Chat
        </button>
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            background: "#007bff",
            color: "white",
            fontSize: 14,
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
