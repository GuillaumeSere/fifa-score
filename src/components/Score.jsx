import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import './score.css';
import "react-datepicker/dist/react-datepicker.css";
import { fetchMatches } from '../api'

const Score = () => {
    const [data, setData] = useState()
    const [date, setDate] = useState(new Date())
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0]
        getCompetitions(currentDate)
    }, [])

    const getCompetitions = async (selectedDate) => {
        try {
            setLoading(true)
            setError(null)
            const result = await fetchMatches(selectedDate, selectedDate)
            setData(result)
        } catch (err) {
            console.error('Erreur:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (event) => {
        setDate(event)
        const selectedDate = event.toISOString().split('T')[0]
        getCompetitions(selectedDate)
    }

    return (
        <div className='fifa'>
            <div className="container">
                <div className="header-section">
                    <h1>Compétitions Football</h1>
                    <div className="date-picker-container">
                        <div className="choice-date">Choisissez une date:</div>
                        <DatePicker
                            selected={date}
                            onChange={handleChange}
                            className="custom-datepicker"
                        />
                    </div>
                </div>

                {loading && (
                    <div className="loading">
                        <h4>Chargement...</h4>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <h4>Erreur: {error}</h4>
                    </div>
                )}

                <div className="competitions-grid">
                    {!loading && !error && data?.competitions?.map((competition) => (
                        <div className="competition-card" key={competition.id}>
                            <div className="card-header">
                                {competition.emblem && (
                                    <img 
                                        src={competition.emblem} 
                                        alt={`Logo ${competition.name}`} 
                                        className="competition-emblem"
                                    />
                                )}
                                <h2 className="competition-name">{competition.name}</h2>
                            </div>
                            
                            <div className="card-body">
                                <div className="competition-info">
                                    <p className="competition-type">
                                        <span className="label">Type:</span> {competition.type}
                                    </p>
                                    <p className="competition-area">
                                        <span className="label">Pays:</span> {competition.area.name}
                                    </p>
                                    <p className="competition-code">
                                        <span className="label">Code:</span> {competition.code || 'N/A'}
                                    </p>
                                </div>

                                <div className="season-info">
                                    <h3>Saison en cours</h3>
                                    <p>
                                        <span className="label">Début:</span> {new Date(competition.currentSeason.startDate).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="label">Fin:</span> {new Date(competition.currentSeason.endDate).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="label">Journée:</span> {competition.currentSeason.currentMatchday || 'N/A'}
                                    </p>
                                </div>

                                <Link 
                                    to={`/fifa-score/team/${competition.id}`} 
                                    className="view-teams-button"
                                >
                                    Voir les équipes
                                </Link>
                            </div>

                            <div className="card-footer">
                                <span className="plan-badge">{competition.type}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && !error && (!data?.competitions || data.competitions.length === 0) && (
                    <div className="no-data">
                        <h4>Pas de compétitions disponibles</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Score
