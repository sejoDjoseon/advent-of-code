
import * as fs from 'fs';
import { EOL } from 'os';

enum GameOption {
    Rock = 1,
    Paper = 2,
    Scissors = 3
}

type OponentOption = "A" | "B" | "C"

function isOfTypeOponentOption(value: string): value is OponentOption {
    return ["A", "B", "C"].includes(value);
}

type OwnOption = "X" | "Y" | "Z"

function isOfTypeOwnOption(value: string): value is OwnOption {
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

const parseOponentOption = (char: OponentOption):  GameOption => (
    {
        A: GameOption.Rock,
        B: GameOption.Paper,
        C: GameOption.Scissors
    }[char]
)

const parseOwnOption = (char: OwnOption):  GameOption => (
    {
        X: GameOption.Rock,
        Y: GameOption.Paper,
        Z: GameOption.Scissors
    }[char]
)

const lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

let sumScore = 0

lines.forEach(line => {
    const [oponent, me] = line.split(" ")
    if (isOfTypeOponentOption(oponent) && isOfTypeOwnOption(me)) {
        sumScore += battle(
            parseOponentOption(oponent), 
            parseOwnOption(me)
            )
        }
})

console.log(sumScore)