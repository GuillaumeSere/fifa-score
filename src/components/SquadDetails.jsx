import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeamDetails } from '../api';
import './squadDetails.css';

const SquadDetails = () => {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTeamSquad = async () => {
            try {
                setLoading(true);
                const response = await fetchTeamDetails(teamId);
                setTeamData(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getTeamSquad();
    }, [teamId]);

    if (loading) {
        return (
            <div className="squad-details-container">
                <div className="loading">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="squad-details-container">
                <div className="error-message">Erreur: {error}</div>
            </div>
        );
    }

    const team = teamData?.teams?.[0];

    return (
        <div className="squad-details-container">
            <div className="squad-header">
                <Link to={`/fifa-score/team/${teamData?.competition?.id}`} className="back-button">
                    ← Retour à l'équipe
                </Link>
                <div className="team-info">
                    {team?.crest && (
                        <img 
                            src={team.crest} 
                            alt={`Logo ${team.name}`}
                            className="team-crest"
                        />
                    )}
                    <h1>{team?.name}</h1>
                </div>
            </div>

            <div className="squad-content">
                <div className="squad-stats">
                    <div className="stat-card">
                        <span className="stat-label">Total Joueurs</span>
                        <span className="stat-value">{team?.squad?.length || 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Moyenne d'âge</span>
                        <span className="stat-value">
                            {team?.squad ? 
                                (team.squad.reduce((acc, player) => acc + (player.age || 0), 0) / team.squad.length).toFixed(1) 
                                : 'N/A'} ans
                        </span>
                    </div>
                </div>

                <div className="squad-sections">
                    {['Gardien', 'Défenseur', 'Milieu', 'Attaquant'].map((position) => (
                        <div key={position} className="position-section">
                            <h2>{position}s</h2>
                            <div className="players-grid">
                                {team?.squad
                                    ?.filter(player => {
                                        const pos = player.position?.toLowerCase();
                                        if (position === 'Gardien') return pos === 'goalkeeper';
                                        if (position === 'Défenseur') return pos?.includes('back');
                                        if (position === 'Milieu') return pos?.includes('midfield');
                                        if (position === 'Attaquant') return pos?.includes('forward') || pos?.includes('striker');
                                        return false;
                                    })
                                    .map((player) => (
                                        <div key={player.id} className="player-card">
                                            <div className="player-header">
                                                <h3>{player.name}</h3>
                                                <span className="player-number">#{player.shirtNumber || 'N/A'}</span>
                                            </div>
                                            <div className="player-details">
                                                <div className="detail-item">
                                                    <span className="detail-label">Âge</span>
                                                    <span className="detail-value">{player.age || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Nationalité</span>
                                                    <span className="detail-value">{player.nationality || 'N/A'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Position</span>
                                                    <span className="detail-value">{player.position || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SquadDetails; 