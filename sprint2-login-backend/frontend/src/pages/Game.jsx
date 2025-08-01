import { useEffect } from 'react';
import '../styles/game.css';

function Game() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/js/tic-tac-toe.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="game-container">
            <div id="tictactoe"></div>
            <div id="turn">Player X</div>
            <label>
                Dark mode:
                <input type="checkbox" id="theme-switch" />
            </label>
        </div>
    );
}

export default Game;
