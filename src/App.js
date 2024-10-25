import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [image, setImage] = useState('');
  const [playedMatches, setPlayedMatches] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/players');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const addPlayer = async () => {
    try {
      const response = await axios.post('http://localhost:5000/players/add', {
        name,
        position,
        image,
        playedBetweenYears: `${startYear}-${endYear}`,
        playedMatches,
      });
      setPlayers([...players, response.data]);
      setName('');
      setPosition('');
      setImage('');
      setStartYear('');
      setEndYear('');
      setPlayedMatches('');
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const deletePlayer = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/players/${id}`);
      setPlayers(players.filter(player => player._id !== id));
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1903; year <= currentYear; year++) {
      years.push(year);
    }
    return years.map(year => <option key={year} value={year}>{year}</option>);
  };

  return (
    <div className="App">
      <h1>Beşiktaş Oyuncu Yönetim Paneli</h1>

      <div>
        <h2>Yeni Oyuncu Ekle</h2>
        <input 
          type="text" 
          placeholder="Oyuncu Adı" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Pozisyon" 
          value={position} 
          onChange={(e) => setPosition(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Maç Sayısı" 
          value={playedMatches} 
          onChange={(e) => setPlayedMatches(e.target.value)} 
        />
        <div className="year-selection">
          <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
            <option value="">Başlangıç Yılı</option>
            {generateYearOptions()}
          </select>
          <select value={endYear} onChange={(e) => setEndYear(e.target.value)}>
            <option value="">Bitiş Yılı</option>
            {generateYearOptions()}
          </select>
        </div>
        <input
          type="string"
          placeholder="Resim Linki"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <button onClick={addPlayer}>Oyuncu Ekle</button>
      </div>

      <div>
        <h2>Oyuncular</h2>
        <ul>
          {players.map((player) => (
            <li key={player._id}>
              <img src={player.image} alt={player.name} className="player-image" />
              {player.name} - {player.position} - {player.playedMatches} - {player.playedBetweenYears}
              <button onClick={() => deletePlayer(player._id)}>Sil</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;