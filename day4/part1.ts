import * as fs from 'fs';
import { EOL } from 'os';

interface Range {
    start: number
    end: number
}

const rangeContains = (container: Range, range: Range): boolean => {
    return range.start >= container.start && range.end <= container.end
}

const hasFullyContains = (p1: Range, p2: Range): boolean => {
    return rangeContains(p1, p2) || rangeContains(p2, p1)
}

const getPairRange = (p: string): Range => {
    const [start, end] = p.split('-')
    return {start: parseInt(start), end: parseInt(end)}
}

const decodePairs = (word: string): {p1: Range, p2: Range} => {
    const [aux1, aux2] = word.split(',')
    return {p1: getPairRange(aux1), p2: getPairRange(aux2)}
}


const lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

let count = 0

lines.forEach(line => {
    const {p1, p2} = decodePairs(line)
    if (hasFullyContains(p1, p2)) count++
})

console.log(count)