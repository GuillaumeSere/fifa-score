const BASE_URL = 'https://api.football-data.org/v4';

export const fetchMatches = async (dateFrom, dateTo) => {
    try {
        const response = await fetch(`${BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
            headers: {
                'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
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
        const teamsResponse = await fetch(`${BASE_URL}/competitions/${competitionId}/teams`, {
            headers: {
                'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
            }
        });

        if (!teamsResponse.ok) {
            throw new Error('Erreur lors de la récupération des équipes');
        }

        const teamsData = await teamsResponse.json();
        return {
            competition: teamsData.competition,
            teams: teamsData.teams
        };
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
};

export const fetchTeamSquad = async (teamId) => {
    try {
        const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
            headers: {
                'X-Auth-Token': process.env.REACT_APP_FOOTBALL_DATA_TOKEN
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de l'effectif`);
        }

        const data = await response.json();
        return {
            team: {
                id: data.id,
                name: data.name,
                crest: data.crest,
                venue: data.venue,
                founded: data.founded,
                area: data.area,
                squad: data.squad || []
            }
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