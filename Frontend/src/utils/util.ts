import { useState, useEffect } from "react";

/** Base URL of the backend API. Configure via VITE_API_URL for production. */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/** Shape of an axios-style error response used across the app's catch blocks. */
export type ApiError = {
  response?: { data?: { message?: string; error?: { reason?: string } } };
};

/** Recharts custom-tooltip props (the subset we render). */
export type ChartTooltipProps = {
  active?: boolean;
  payload?: { value: number }[];
  label?: string | number;
};

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
type Message = {
    name : string,
    party : string,
    hash : string,
    time : string
}
export const useWebSocket = () => {
    const [messages, setMessages] = useState<Message | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        console.log("ws",ws)
        ws.onopen = () => console.log("Connected to WebSocket Server");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(data);
        };
        ws.onclose = () => console.log("Disconnected from WebSocket Server");
        return () => ws.close();
    }, []);

    return messages;
};
