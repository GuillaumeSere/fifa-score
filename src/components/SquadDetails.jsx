import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeamSquadDetails } from '../api';
import './teamDetails.css';

const SquadDetails = () => {
    const { teamId } = useParams();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getSquadDetails = async () => {
            try {
                setLoading(true);
                const response = await fetchTeamSquadDetails(teamId);
                setTeamData(response.team);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getSquadDetails();
    }, [teamId]);

    const getPositionInFrench = (position) => {
        switch(position) {
            case 'Goalkeeper': return 'Gardien';
            case 'Defence': return 'Défenseur';
            case 'Midfield': return 'Milieu';
            case 'Offence': return 'Attaquant';
            default: return position;
        }
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div className="team-details-container">
                <div className="loading">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="team-details-container">
                <div className="error-message">Erreur: {error}</div>
            </div>
        );
    }

    return (
        <div className="team-details-container">
            <div className="team-details-header">
                <Link to={`/fifa-score/team/${teamId}`} className="back-button">
                    ← Retour à l'équipe
                </Link>
                <div className="team-header">
                    {teamData?.crest && (
                        <img 
                            src={teamData.crest} 
                            alt={`Logo ${teamData.name}`}
                            className="team-crest"
                        />
                    )}
                    <h1>{teamData?.name || 'Effectif de l\'équipe'}</h1>
                </div>
            </div>

            <div className="team-details-content">
                <div className="squad-section">
                    {['Goalkeeper', 'Defence', 'Midfield', 'Offence'].map((position) => (
                        <div key={position} className="position-group">
                            <h4>{getPositionInFrench(position)}s</h4>
                            <div className="squad-grid">
                                {teamData?.squad
                                    ?.filter(player => player.position === position)
                                    .map((player) => (
                                        <div key={player.id} className="player-card">
                                            <div className="player-info">
                                                <h4>{player.name}</h4>
                                                <span className="player-position">
                                                    #{player.shirtNumber || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="player-stats">
                                                <div className="stat">
                                                    <span className="stat-label">Âge</span>
                                                    <span className="stat-value">
                                                        {calculateAge(player.dateOfBirth)}
                                                    </span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-label">Nationalité</span>
                                                    <span className="stat-value">
                                                        {player.nationality || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-label">Valeur</span>
                                                    <span className="stat-value">
                                                        {(player.marketValue / 1000000).toFixed(1)}M€
                                                    </span>
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