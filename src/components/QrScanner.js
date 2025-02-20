import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = () => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

        // Lorsqu'un QR Code est scanné, il envoie les données via WebSocket
        scanner.render((decodedText) => {
            const socket = new WebSocket('ws://192.168.1.82:8081');
            socket.onopen = () => {
                socket.send(decodedText);
            };
        });
    }, []);

    return (
        <div>
            <div id="reader" style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default QrScanner;
