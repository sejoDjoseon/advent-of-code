import * as fs from 'fs';
import { EOL } from 'os';

let lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)
//lines = lines.slice(0, 2)

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
    let newTPos: Position = TPos
    if (Math.abs(horizontalDis) === Math.abs(verticalDis)) {
        if (horizontalDis > 0) {
            // goes right
            newTPos = incrementPosition(newTPos, Direction.Right)
        } else  {
            // goes left
            newTPos = incrementPosition(newTPos, Direction.Left)
        }
        if (verticalDis > 0) {
            // goes down
            newTPos = incrementPosition(newTPos, Direction.Down)
        } else  {
            // goes up
            newTPos = incrementPosition(newTPos, Direction.Up)
        }
    } else if (Math.abs(horizontalDis) > Math.abs(verticalDis)) {
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

let tailVisitedPositions: Position[] = [startPosition]

const knots = [
    startPosition,
    startPosition, startPosition, startPosition, 
    startPosition, startPosition, startPosition, 
    startPosition, startPosition, startPosition
]

const printPositions = () => {
    let maxY = 8
    let maxX = 8
    let minY = -8
    let minX = -8
    knots.forEach(knot => {
        if (knot.x > maxX) maxX = knot.x
        if (knot.x < minX) minX = knot.x
        if (knot.y < minY) minY = knot.y
        if (knot.y > maxY) maxY = knot.y
    });
    for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
            const aux = new Position(x, y)
            const index = knots.findIndex((knot) => 
                knot.isEqual(aux)
            )
            if (index > -1) {
                process.stdout.write(`${index} `)
            } else {
                process.stdout.write('. ')
            }
            
        }
        console.log('')
    }
}

lines.forEach(line => {
    // console.log(line)
    const {dir, dist} = parseLine(line)
    for (let index = 0; index < dist; index++) {
        // console.log(index + 1)
        knots[0] = incrementPosition(knots[0], dir)
        for (let n = 1; n < knots.length; n++) {
            const prev = knots[n-1]
            const current = knots[n]
            if (current.distance(prev) > 1) {
                if (n === 9) {
                    knots[n] = updateTailPosition(prev, current)
                    if (!tailVisitedPositions.find(p => p.isEqual(knots[n]))) {
                        tailVisitedPositions.push(knots[n])
                    }
                } else {
                    const next = knots[n+1]
                    knots[n] = updateTailPosition(prev, current)
                }
            }
        }
        // printPositions()
        // console.log('=======================')
    }
    // console.log('#######################')
});

console.log({result: tailVisitedPositions.length})