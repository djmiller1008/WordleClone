import React from "react";
import { useState, useEffect } from "react";
import './App.css';

const API_URL = 'https://random-word-api.herokuapp.com/word?length=5'
const WORD_LENGTH = 5;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const App = () => {
    const [solution, setSolution] = useState(null);
    const [guesses, setGuesses] = useState(Array(6).fill(null));
    const [currentGuess, setCurrentGuess] = useState("");
    const [guessesIndex, setGuessesIndex] = useState(0);
    const [isWinner, setIsWinner] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    window.currentGuess = currentGuess;
    window.guesses = guesses;

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(word => setSolution(word.toString()));
    }, []); 

    useEffect(() => {
        const handleInput = (event) => {
            if (ALPHABET.includes(event.key)) {
                setCurrentGuess(currentGuess + event.key);
            }
        }

        if (currentGuess.length === 5) {
            let newGuesses = [...guesses];
            newGuesses[guessesIndex] = currentGuess;
            setGuesses(newGuesses);
            setGuessesIndex(guessesIndex + 1);
            setCurrentGuess("");
        }

        if (currentGuess === solution) {
            setIsWinner(true);
        }
        
        if (isWinner) {
            alert("Winner!");
        }

        if (guessesIndex === 5 && currentGuess.length === 5 && currentGuess !== solution) {
            setIsGameOver(true);
        }

        if (isGameOver) {
            alert("Game Over :(");
        }
        if (!isGameOver && !isWinner) {
            window.addEventListener('keydown', handleInput);
        }

        return () => window.removeEventListener('keydown', handleInput);
    }, [currentGuess, guesses, guessesIndex, isWinner, solution, isGameOver]) 

    const refreshPage = () => {
        window.location.reload(false);
    }
   
    return (
        <div className="board">
            <button className="new-game-button" onClick={refreshPage}>New Game</button>
            {
                guesses.map((guess, i) => {
                    const isCurrentGuess = i === guesses.findIndex(val => val == null);
                    return <Line key={i} solution={solution} guess={isCurrentGuess ? currentGuess : guess ?? ""} />
                })
            }
        </div>
    )
};

const Line = ({ solution, guess }) => {
    let tiles = [];

    if (guess.length === WORD_LENGTH) {
        for (let i = 0; i < WORD_LENGTH; i++) {
            const char = guess[i];
            if (guess[i] === solution[i]) {
                tiles.push(<div key={i} className="tile correct">{char}</div>)
            } else if (solution.includes(char)) {
                tiles.push(<div key={i} className="tile almost">{char}</div>)
            } else {
                tiles.push(<div key={i} className="tile incorrect">{char}</div>)
            }
        }
    } else {
        for (let i = 0; i < WORD_LENGTH; i++) {
            const char = guess[i];
            tiles.push(<div key={i} className="tile">{char}</div>)     
            
        }
    }

    return (
        <div className="line">
           {tiles}
        </div>
    )
}






export default App;



