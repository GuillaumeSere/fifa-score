import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import './score.css';
import "react-datepicker/dist/react-datepicker.css";
import API from '../api'

const Score = () => {

    const [data, setData] = useState()
    const [date, setDate] = useState(new Date())

    useEffect(() => {

        const currentDate = new Date().toISOString().split('T')[0]

        API.get(`schedule`, {
            params: { date: `${currentDate}`, utc_offset: '8' },
            headers: {
                'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_API_KEY}`,
                'X-RapidAPI-Host': 'fifa-2022-schedule-and-stats.p.rapidapi.com'
            }
        }).then((res) => {
            setData(res)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const handleChange = (event) => {
        setDate(event)
        const selectedDate = event.toISOString().split('T')[0]

        API.get(`schedule`, {
            params: { date: `${selectedDate}`, utc_offset: '8' },
            headers: {
                'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_API_KEY}`,
                'X-RapidAPI-Host': 'fifa-2022-schedule-and-stats.p.rapidapi.com'
            }
        }).then((res) => {
            setData(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className='fifa'>
            <div className="terrain"></div>
            <div className="terrain-center"></div>
            <div className="container">

                <div className="match">
                    <p>Résultat des matchs</p>
                    <div className="choice-date">Choisissez une date:</div>
                    <DatePicker
                        selected={date}
                        onChange={handleChange}
                     
                    />
                    {data?.data?.matches.map(({ Home, Away }) =>

                        <div className="match-content" key={Home?.IdCountry}>
                            <div className="column">

                                <div className="team">
                                    <h2 className="team-name">{Home?.ShortClubName === undefined ? "Undeterminded" : Home?.ShortClubName}</h2>
                                </div>
                            </div>
                            <div className="column">
                                <div className="match-details">

                                    <div className="match-score">
                                        <span className="match-score-number match-score-number--leading">{Home?.Score}</span>
                                        <span className="match-score-divider">:</span>
                                        <span className="match-score-number">{Away?.Score}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="column">
                                <div className="team">
                                    <h2 className="team-name">{Away?.ShortClubName === undefined ? "Undeterminded" : Away?.ShortClubName}</h2>
                                </div>
                            </div>
                        </div>

                    )}
                    {data?.data?.matches.length === 0 ?
                        <div>
                            <h4 className='no-match'>Pas de match ce jour</h4>
                        </div> : ""
                    }

                </div>
            </div>
        </div>
    )
}

export default Score
