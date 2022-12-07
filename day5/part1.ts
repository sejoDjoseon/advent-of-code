import * as fs from 'fs';
import { EOL } from 'os';

type stack = string[]

let lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

let cargo: stack[] = []

const stackCount = Math.ceil(lines[0].length / 4)
for (let index = 0; index < stackCount; index++) {
    cargo[index] = []
}


const decodeCratesLine = (line: string) => {
    const stackCount = Math.ceil(line.length / 4)

    let lastIndex = 0
    for (let index = 1; index < stackCount; index++) {
        const element = line.substring(lastIndex*4, index * 4)
        lastIndex = index
        if (element.includes('[')) {
            cargo[index-1].push(element.substring(1,2))
        }
    }
    // ultim cas
    const element = line.substring(lastIndex*4)
    if (element.includes('[')) {
        cargo[lastIndex].push(element.substring(1,2))
    }
}

const moveElements = (line: string) => {
    const parts = line.split(' ')
    const countElements = parseInt(parts[1])
    const from = parseInt(parts[3])
    const to = parseInt(parts[5])
    const elementsTomove = cargo[from-1].splice(0, countElements).reverse()
    cargo[to-1].unshift(...elementsTomove)
}

lines.forEach(line => {
    if (line.includes('[')) {
        decodeCratesLine(line)
    } else if (line.includes('move')) {
        moveElements(line)
    }
})

let result = ''

cargo.forEach(stack => {
    const first = stack[0]
    result = result.concat(first)
});

console.log({result})