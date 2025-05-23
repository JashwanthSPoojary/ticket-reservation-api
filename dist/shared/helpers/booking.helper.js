"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePnrNumber = generatePnrNumber;
exports.calculateTicketStatus = calculateTicketStatus;
function generatePnrNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `PNR${result}`;
}
function calculateTicketStatus(confirmedAvailable, racAvailable, waitingAvailable) {
    if (confirmedAvailable > 0)
        return 'CONFIRMED';
    if (racAvailable > 0)
        return 'RAC';
    if (waitingAvailable > 0)
        return 'WAITING';
    return null;
}
