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

const isVisibleDirection = (tree: number, dir: direction, position: Position ): boolean => {
    const newPosition = incrementDirection(position, dir)
    if (newPosition.x < 0 || newPosition.x >= maxX || newPosition.y < 0 || newPosition.y >= maxY ) {
        return true
    } else if (tree <= matrix[newPosition.x][newPosition.y]) {
        return false
    } else {
        return isVisibleDirection(tree, dir, newPosition)
    }
}

const isVisible = (position: Position): boolean => {
    const tree = matrix[position.x][position.y]
    const directions: direction[] = ['up', 'right', 'down', 'left']

    const isVisibleAllDirections = directions.some(dir => {
        return isVisibleDirection(tree, dir, position)
    })
    return isVisibleAllDirections
}

let visiblesCount = maxX * maxY

for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
        const position: Position = {x: x, y: y}
        if (!isVisible(position)) {
            visiblesCount--
        }
    }
}

console.log(visiblesCount)