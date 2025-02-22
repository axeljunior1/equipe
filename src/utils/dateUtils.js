// src/utils/dateUtils.js
/**
 *
 * @param dateString format 2025-02-02T22:13:06.000917
 * 2025-02-21T21:51:40
 * @returns {string} format 2 février 2025 à 22:13:06
 */
export const formatDate = (dateString) => {
    if (!dateString) return "";
    // Si la date a un format ISO 8601 sans millisecondes, ajouter un "Z" à la fin pour indiquer UTC
    if (dateString.length === 19 && !dateString.includes(".")) {
        dateString += "Z";
    }

    // Créer un objet Date à partir de la chaîne modifiée
    const date = new Date(dateString);

    // Vérifier si la conversion de la chaîne en date a échoué
    if (isNaN(date)) {
        console.error("Date invalide:", dateString);
        return "Date invalide"; // Retourner une erreur si la date est invalide
    }

    // Formater la date en français
    return date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};



