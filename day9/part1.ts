import * as fs from 'fs';
import { EOL } from 'os';

let lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

enum Direction {
    Right = 'R',
    Down = 'D',
    Left = 'L',
    Up = 'U'
} 

class Position {
    x: number
    y: number

    constructor(x: number, y:number) {
        this.x = x
        this.y = y
    }
    
    isEqual(position: Position): boolean {
        return position.x === this.x && position.y === this.y
    }

    distance(position: Position): number {
        const horizontalDis = Math.abs(position.x - this.x)
        const verticalDis = Math.abs(position.y - this.y)
        return Math.max(horizontalDis, verticalDis)
    }
}

function parseLine(line: string): {dir: Direction, dist: number} {
    const [direction, distance] = line.split(' ')
    return {dir: direction as Direction, dist: parseInt(distance)}
}

function incrementPosition(pos: Position, dir: Direction): Position {
    const newPosition: {x: number, y: number} = {
        [Direction.Up]: {x: pos.x, y: pos.y - 1},
        [Direction.Right]: {x: pos.x + 1, y: pos.y},
        [Direction.Down]: {x: pos.x, y: pos.y + 1},
        [Direction.Left]: {x: pos.x - 1, y: pos.y}
    }[dir]

    return new Position(newPosition.x, newPosition.y)
}

function updateTailPosition(HPos: Position, TPos: Position): Position {
    const horizontalDis = HPos.x - TPos.x
    const verticalDis = HPos.y - TPos.y
    let newTPos: Position
    if (Math.abs(horizontalDis) > Math.abs(verticalDis)) {
        if (horizontalDis > 0) {
            // goes right
            newTPos = incrementPosition(HPos, Direction.Left)
        } else  {
            // goes left
            newTPos = incrementPosition(HPos, Direction.Right)
        }
    } else {
        if (verticalDis > 0) {
            // goes down
            newTPos = incrementPosition(HPos, Direction.Up)
        } else  {
            // goes up
            newTPos = incrementPosition(HPos, Direction.Down)
        }
    }

    return newTPos
}

const startPosition = new Position(0, 0)

let tailVisitedPostions: Position[] = [startPosition]

let positionT = startPosition
let positionH = startPosition

lines.forEach(line => {
    const {dir, dist} = parseLine(line)

    for (let index = 0; index < dist; index++) {
        positionH = incrementPosition(positionH, dir)
        if (positionT.distance(positionH) > 1) {
            positionT = updateTailPosition(positionH, positionT)
            if (!tailVisitedPostions.find(p => p.isEqual(positionT))) {
                tailVisitedPostions.push(positionT)
            }
        }
    }
});

console.log({result: tailVisitedPostions.length})