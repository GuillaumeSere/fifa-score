const API_URL = "https://api.football-data.org/v4/competitions";
const BASE_URL = "https://api.football-data.org/v4/teams";

export const fetchMatches = async (dateFrom, dateTo) => {
    try {
        console.log('Envoi de la requête à:', API_URL);
        
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


export const fetchTeamDetails = async (competitionId) => {
    try {
        // Récupérer les équipes de la compétition
        const teamsResponse = await fetch(`${API_URL}/${competitionId}/teams`, {
            headers: {
                'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
            }
        });

        if (!teamsResponse.ok) {
            throw new Error('Erreur lors de la récupération des équipes');
        }

        const teamsData = await teamsResponse.json();

        // Pour chaque équipe, récupérer les détails des joueurs
        const teamsWithSquad = await Promise.all(
            teamsData.teams.map(async (team) => {
                try {
                    const squadResponse = await fetch(`${BASE_URL}/${team.id}`, {
                        headers: {
                            'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
                        }
                    });

                    if (!squadResponse.ok) {
                        throw new Error(`Erreur lors de la récupération de l'effectif de ${team.name}`);
                    }

                    const squadData = await squadResponse.json();
                    console.log(squadData)
                    return {
                        ...team,
                        squad: squadData.squad || []
                    };
                } catch (error) {
                    console.error(`Erreur pour l'équipe ${team.name}:`, error);
                    return {
                        ...team,
                        squad: []
                    };
                }
            })
        );

        return {
            competition: teamsData.competition,
            teams: teamsWithSquad
        };
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};

export const fetchTeamSquadDetails = async (teamId) => {
    try {
        const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
            headers: {
                'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des détails de l\'effectif');
        }

        const data = await response.json();
        return {
            team: {
                id: data.id,
                name: data.name,
                crest: data.crest,
                squad: data.squad || []
            }
        };
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}; 
