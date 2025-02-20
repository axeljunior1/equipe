import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketClient = () => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const socket = new SockJS("http://192.168.1.82:8080/ws");
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connecté");
                stompClient.subscribe("/topic/messages", (message) => {
                    setMessages((prev) => [...prev, message.body]);
                });
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const sendMessage = () => {
        console.log("input ", input);
        if (client && input.trim() !== "") {
            console.log("client && input ", input);

            client.publish({ destination: "/app/send", body: input });
            console.log('client.publish')
            setInput("");
        }
    };

    return (
        <div>
            <h1>WebSocket React - Spring Boot</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Entrez un message"
            />
            <button onClick={sendMessage}>Envoyer</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketClient;
