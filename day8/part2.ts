import * as fs from 'fs';
import { EOL } from 'os';

let lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

let matrix: number[][] = []
const maxX = lines[0].length
let maxY = 0

lines.forEach(line => {
    const row: number[] = []
    for (let index = 0; index < line.length; index++) {
        row.push(parseInt(line[index]))
    }
    matrix.push(row)
    maxY++
});

type direction = 'up' | 'right' | 'down' | 'left'
interface Position {
    x: number,
    y: number
}

const incrementDirection = (position: Position, dir: direction): Position => {
    switch (dir) {
        case 'up':
            return {x: position.x, y: position.y - 1}
        case 'right':
            return {x: position.x + 1, y: position.y}
        case 'down':
            return {x: position.x, y: position.y + 1}
        case 'left':
            return {x: position.x - 1, y: position.y}
        default:
            return position
    }
}

const getScenicScoreDirection = (tree: number, dir: direction, position: Position, count: number): number => {
    const newPosition = incrementDirection(position, dir)
    if (newPosition.x < 0 || newPosition.x >= maxX || newPosition.y < 0 || newPosition.y >= maxY ) {
        return count
    } else if (tree <= matrix[newPosition.x][newPosition.y]) {
        return count + 1
    } else {
        return getScenicScoreDirection(tree, dir, newPosition, count + 1)
    }
}

const getScenicScore = (position: Position): number => {
    const tree = matrix[position.x][position.y]
    const directions: direction[] = ['up', 'right', 'down', 'left']
    let scores: number[] = []

    directions.forEach(dir => {
        scores.push(
            getScenicScoreDirection(tree, dir, position, 0)
        )
    })
    return scores[0] * scores[1] * scores[2] * scores[3]
}

let highestScenicScoreTree = 0

for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
        const position: Position = {x: x, y: y}
        const scenicScore = getScenicScore(position)
        if (scenicScore > highestScenicScoreTree) {
            highestScenicScoreTree = scenicScore
        }
    }
}

console.log({highestScenicScoreTree})