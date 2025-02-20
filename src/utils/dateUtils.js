// src/utils/dateUtils.js
/**
 *
 * @param dateString format 2025-02-02T22:13:06.000917
 * @returns {string} format 2 février 2025 à 22:13:06
 */
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};



