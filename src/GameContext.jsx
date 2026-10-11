import { createContext, useContext, useEffect, useRef, useState } from "react";

const NUM_HOLES = 9;
const TIME_LIMIT = 15;

const GameContet = createContext();


export default function GameProvider({ children }) {
    const [field, setField] = useState(makeField());
    const [score, setScore] = useState(0);
    const [highScores, setHighScores] = useState([]);
    const [playing, setPlaying] = useState(false);

    const [time , setTime] = useState(TIME_LIMIT);
    const timer = useRef();

    useEffect(() => {
        if (time <= 0) stop();
    }, [time]);
    

    const start = () => {
        setScore(0);
        setField(makeField());
        setPlaying(true);

        timer.current = setInterval(() => setTime((time) => time - 1), 1000);
    };


    const stop = () => {
        setPlaying(false);

        const newScores = [...highScores, score].sort((a, z) => z - a);
        setHighScores(newScores.slice(0, 5));

        clearInterval(timer.current);
        setTime(TIME_LIMIT);
    };

    const value = {
        field,
        score,
        highScores,
        playing,
        time,
        whack,
        start,
        stop;
    };
    return <GameContet.Provider value={value}>{children}</GameContet.Provider>;

}

export function useGame() {
    const context =useContext(GameContet);
    if (!context) throw Error("GTame context must be used whthin GameProvider.");
    return context;
}

/**@returns {boolean[]} false = hole, true = ,*/
function makeField(field = Array(NUM_HOLES).fill(false)) {
    const holes = field.reduce((holes, isMole, i) => {
        if (!isMole) holes.push(i);
        return holes;
    }, []);
    const mole = holes[Math.floor(Math.random() * holes.length)];

    const newField = Array(NUM_HOLES).fill(false);
    newField[mole] = true;
    return newField
}