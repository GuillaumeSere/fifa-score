const API_URL = "https://api.football-data.org/v4/competitions";

export const fetchMatches = async (dateFrom, dateTo) => {
    try {
        console.log('Envoi de la requête à:', API_URL);
        console.log('Token utilisé:', process.env.REACT_APP_FOOTBALL_DATA_TOKEN);
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
            }
        });
        
        console.log('Statut de la réponse:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Réponse d\'erreur:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données reçues:', data);
        return data;
    } catch (error) {
        console.error('Erreur détaillée:', error);
        throw error;
    }
};