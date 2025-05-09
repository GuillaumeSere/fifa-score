import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeamDetails } from '../api';
import './teamDetails.css';

const TeamDetails = () => {
    const { competitionId } = useParams();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getTeamDetails = async () => {
            try {
                setLoading(true);
                const response = await fetchTeamDetails(competitionId);
                setTeamData(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getTeamDetails();
    }, [competitionId]);

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
                <Link to="/fifa-score" className="back-button">
                    ← Retour aux compétitions
                </Link>
            </div>
            <h1>{teamData?.competition?.name || 'Détails de la compétition'}</h1>

            <div className="team-details-content">
                {teamData?.teams?.map((team) => (
                    <div key={team.id} className="team-info-section">
                        <div className="team-header">
                            {team.crest && (
                                <img 
                                    src={team.crest} 
                                    alt={`Logo ${team.name}`}
                                    className="team-crest"
                                />
                            )}
                            <h2>{team.name}</h2>
                        </div>

                        <div className="team-stats">
                            <div className="stat-item">
                                <span className="stat-label">Stade</span>
                                <span className="stat-value">{team.venue || 'N/A'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Fondé en</span>
                                <span className="stat-value">{team.founded || 'N/A'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Pays</span>
                                <span className="stat-value">{team.area?.name || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="squad-section">
                            <Link 
                                to={`/fifa-score/team/${team.id}/squad`}
                                className="view-squad-button"
                            >
                                Voir l'effectif complet
                            </Link>
                            <div className="squad-grid">
                                {team.squad?.map((player) => (
                                    <div key={player.id} className="player-card">
                                        <div className="player-info">
                                            <h4>{player.name}</h4>
                                            <span className="player-position">{player.position}</span>
                                        </div>
                                        <div className="player-stats">
                                            <div className="stat">
                                                <span className="stat-label">Âge</span>
                                                <span className="stat-value">{player.age || 'N/A'}</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">Nationalité</span>
                                                <span className="stat-value">{player.nationality || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamDetails; 