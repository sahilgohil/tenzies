import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import { useWindowSize } from 'react-use';

export default function App() {

    const [dice, setDice] = React.useState(()=>allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const { width, height } = useWindowSize()
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
        else if(allHeld)
        {

        }
    }, [dice])

    let message = getTitle(dice)

    function getTitle(arr)
    {
        const allHeld = arr.every(die => die.isHeld)
        const firstValue = arr[0].value || 0
        const allSameValue = arr.every(die => die.value === firstValue)
        if(allHeld)
        {
            if(allSameValue)
            {
                return 'Congretulations, You won the Game!'
            }
            else
            {
                return 'not all die are same..'
            }
        }
        else
        {
            return 'Tenzies'
        }
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti width={width}
                                    height={height} />}
            <h1 className="title">{message}</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}