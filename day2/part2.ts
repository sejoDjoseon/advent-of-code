
import * as fs from 'fs';
import { EOL } from 'os';

enum GameOption {
    Rock = 1,
    Paper = 2,
    Scissors = 3
}

enum GameResult {
    Lose = 0,
    Draw = 3,
    Win = 6
}

type OponentOption = "A" | "B" | "C"

function isOfTypeOponentOption(value: string): value is OponentOption {
    return ["A", "B", "C"].includes(value);
}

type Result = "X" | "Y" | "Z"

function isOfTypeResult(value: string): value is Result {
    return ["X", "Y", "Z"].includes(value);
}

const battle = (oponent: GameOption, me: GameOption): number => {
    let result: number = me
    if (oponent === GameOption.Rock) {
        if (me === GameOption.Rock) {
            result += 3 
        } else if (me === GameOption.Paper) {
            result += 6 
        }
    } else if  (oponent === GameOption.Paper) {
        if (me === GameOption.Paper) {
            result += 3 
        } else if (me === GameOption.Scissors) {
            result += 6 
        }
    } else {
        if (me === GameOption.Scissors) {
            result += 3 
        } else if (me === GameOption.Rock) {
            result += 6 
        }
    }

    return result
}

const chooseOption = (oponent: GameOption, bresult: GameResult): GameOption => {
    if (oponent === GameOption.Rock) {
        if (bresult === GameResult.Win) {
            return GameOption.Paper
        } else  if (bresult === GameResult.Draw) {
            return GameOption.Rock
        } else {
            return GameOption.Scissors
        }
    } else if (oponent === GameOption.Paper) {
        if (bresult === GameResult.Win) {
            return GameOption.Scissors
        } else  if (bresult === GameResult.Draw) {
            return GameOption.Paper
        } else {
            return GameOption.Rock
        }
    } else {
        if (bresult === GameResult.Win) {
            return GameOption.Rock
        } else  if (bresult === GameResult.Draw) {
            return GameOption.Scissors
        } else {
            return GameOption.Paper
        }
    }
}

const parseOponentOption = (char: OponentOption):  GameOption => (
    {
        A: GameOption.Rock,
        B: GameOption.Paper,
        C: GameOption.Scissors
    }[char]
)

const parseResult = (char: Result):  GameResult => (
    {
        X: GameResult.Lose,
        Y: GameResult.Draw,
        Z: GameResult.Win
    }[char]
)

const lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

let sumScore = 0

lines.forEach(line => {
    const [oponent, result] = line.split(" ")
    if (isOfTypeOponentOption(oponent) && isOfTypeResult(result)) {
        const oponentOption = parseOponentOption(oponent)
        const me = chooseOption(oponentOption, parseResult(result))
        
        sumScore += battle(oponentOption, me)
        }
})

console.log(sumScore)