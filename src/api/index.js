const API_KEY = 'VOTRE_CLE_API'; // Remplacez par votre clé API Football-Data.org
const BASE_URL = 'https://api.football-data.org/v4';

export const fetchMatches = async (dateFrom, dateTo) => {
    try {
        const response = await fetch(`${BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des matchs');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};

export const fetchTeamDetails = async (competitionId) => {
    try {
        // Récupérer les équipes de la compétition
        const teamsResponse = await fetch(`${BASE_URL}/competitions/${competitionId}/teams`, {
            headers: {
                'X-Auth-Token': API_KEY
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
                    const squadResponse = await fetch(`${BASE_URL}/teams/${team.id}`, {
                        headers: {
                            'X-Auth-Token': API_KEY
                        }
                    });

                    if (!squadResponse.ok) {
                        throw new Error(`Erreur lors de la récupération de l'effectif de ${team.name}`);
                    }

                    const squadData = await squadResponse.json();
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