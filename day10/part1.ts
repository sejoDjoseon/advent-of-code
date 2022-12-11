import * as fs from "fs";
import { EOL } from "os";

let lines = fs.readFileSync("input.txt", "utf-8").split(EOL);

enum Instruction {
    Noop = "noop",
    Add = "addx",
}

class Process {
    intruction: Instruction
    cycles: number
    clocks: number = 0

    constructor(instruction: Instruction) {
        this.intruction = instruction;
        this.cycles = this.instructionCycles(instruction)
    }

    private instructionCycles(instruction: Instruction): number {
        return {
            [Instruction.Add]: 2,
            [Instruction.Noop]: 1
        }[instruction]
    }

    tick() {
        this.clocks++
    }

    isFinished(): boolean {
        return this.cycles === this.clocks
    }

    perform(): (((param: number, register: number) => number)) {
        return {
            [Instruction.Add]: (param: number, register: number) => (param + register),
            [Instruction.Noop]: (_param: number, register: number) => register
        }[this.intruction]
    }
}

function parseInstruction(line: string): { inst: Instruction, value: number } {
    const [inst, value] = line.split(' ')
    return { inst: inst as Instruction, value: !value ? 0 : parseInt(value) }
}

let currentClock = 0
let registerX = 1
let instructionIndex = 0

const { inst, value } = parseInstruction(lines[instructionIndex])
let currentInstruction = new Process(inst)
let currentParam = value

let signalStrengths: number[] = []

const readInstruction = () => {
    if (!!lines[instructionIndex]) {
        const { inst, value } = parseInstruction(lines[instructionIndex])
        currentInstruction = new Process(inst)
        currentParam = value
    }
}

while (instructionIndex < lines.length) {
    currentClock++
    currentInstruction.tick()
    signalStrengths[currentClock - 1] = currentClock * registerX
    if (currentInstruction.isFinished()) {
        const action = currentInstruction.perform()
        registerX = action(currentParam, registerX)
        instructionIndex++
        readInstruction()
    }
}

let result = 0

const observedCycles = [20, 60, 100, 140, 180, 220]

observedCycles.forEach((cycle) => {
    result += signalStrengths[cycle - 1]
})

console.log({ result })