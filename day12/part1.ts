import * as fs from "fs";
import { EOL } from "os";

let lines = fs.readFileSync("input.txt", "utf-8").split(EOL);

const YMAX = lines.length
const XMAX = lines[0].length

type Coordinates = { x: number, y: number }

enum Direction {
    Up = '^',
    Right = '>',
    Down = 'v',
    Left = '<'
}

type MovementSquare = Direction | '.' | 'E'
type Map = Location[][]
type PreviousPosition = Coordinates | null

class Location {
    position: Coordinates
    elevation: number
    char: string

    visited: boolean = false
    distance: number = Infinity
    step: MovementSquare = '.'
    previousPosition: PreviousPosition = null

    constructor(location: Coordinates, elevation: number, char: string) {
        this.position = location
        this.elevation = elevation
        this.char = char
    }

    getPosition(): Coordinates {
        return this.position
    }

    getPosibleDirections(): Direction[] {
        const directions: Direction[] = []
        this.position.y != 0 && directions.push(Direction.Up)
        this.position.x != 0 && directions.push(Direction.Left)
        this.position.y < YMAX - 1 && directions.push(Direction.Down)
        this.position.x < XMAX - 1 && directions.push(Direction.Right) 
        return directions
    }

    canGoTo(position: Location): boolean {
        return (
                position.elevation <= this.elevation || 
                position.elevation === this.elevation + 1
            ) && !position.visited
    }

    setVisited() {
        this.visited = true
    }

    setDistance(dist: number) {
        this.distance = dist
    }

    setStep(movement: MovementSquare) {
        this.step = movement
    }

    setPrevPosition(prev: Coordinates) {
        this.previousPosition = prev
    }
}

const map: Location[][] = []
let startPosition: Location
let endPosition: Location

const printMap = (map: Map, item: 'visiteds' | 'distances' | 'steps' | 'prevPos' | 'chars') => {
    map.forEach(row => {
        row.forEach(location => {
            item === 'visiteds' && process.stdout.write(`${location.visited.toString()} `)
            item === 'distances' && process.stdout.write(`${location.distance.toString()} `)
            item === 'steps' && process.stdout.write(`${location.step} `)
            if (item === 'prevPos') {
                const prevPos = location.previousPosition
                !prevPos && process.stdout.write(`null `)
                !!prevPos && process.stdout.write(`(${prevPos.x},${prevPos.y}) `)

            }
            item  === 'chars' && process.stdout.write(`${location.char} `)
        })
        process.stdout.write(EOL)
    })
}

function parseElevation(char: string): number {
    if (char === 'E') {
        return 'z'.charCodeAt(0)
    }
    if (char === 'S') {
        return 'a'.charCodeAt(0)
    }
    return char.charCodeAt(0)
}

function parseLocation(char: string, coords: Coordinates): Location {
    const location = new Location(coords, parseElevation(char), char)
    if (char === 'E') {
        endPosition = location
    } 
    if (char === 'S') {
        startPosition = location
        startPosition.distance = 0
    }
    return location
}

// read input
for (let y = 0; y < YMAX; y++) {
    const row: Location[] = []
    lines[y].split('').forEach((char, x) => {
        row.push(parseLocation(char, {x, y}))
    })
    map.push(row)
}

const getPositionByDir = (currPosition: Coordinates, dir: Direction): Coordinates => {
    return {
        [Direction.Up]: { x: currPosition.x, y: currPosition.y - 1 },
        [Direction.Right]: { x: currPosition.x + 1, y: currPosition.y },
        [Direction.Down]: { x: currPosition.x, y: currPosition.y + 1 },
        [Direction.Left]: { x: currPosition.x - 1, y: currPosition.y },
    }[dir]
}

const dijkstra = () => {
    const pending: Location[] = []
    pending.push(startPosition)

    while (pending.length != 0) {
        const currentLocation = pending.pop()!
        const { distance: currDistance, position: currPosition } = currentLocation
        const directions = currentLocation.getPosibleDirections()
        directions.forEach(dir => {
            const position = getPositionByDir(currPosition, dir)
            const location = map[position.y][position.x]
            if (currentLocation.canGoTo(location)) {
                const distNewLocation = currDistance + 1
                if (distNewLocation < location.distance) {
                    location.setDistance(distNewLocation)
                    location.setPrevPosition(currPosition)
                    pending.push(location)
                    pending.sort((a, b) => b.distance - a.distance)
                }
            }
        })
        currentLocation.setVisited()
    }
}

function stepFromPositions(from: Coordinates, to: Coordinates): Direction {
    if (from.x + 1 === to.x) {
        return Direction.Right
    } else if (from.y + 1 === to.y) {
        return Direction.Down
    } else if (from.x - 1 === to.x) {
        return Direction.Left
    } else {
        return Direction.Up
    }
}

let countSteps = 0

const shortPathSteps = () => {
    let currentLocation = endPosition
    currentLocation.setStep('E')
    while (currentLocation !== startPosition) {
        const prevPosition = currentLocation.previousPosition!
        const step = stepFromPositions(prevPosition, currentLocation.position)
        currentLocation = map[prevPosition.y][prevPosition.x]
        currentLocation.setStep(step)
        countSteps++
    }
}

dijkstra()

printMap(map, 'chars')
// printMap(map, 'distances')
// printMap(map, 'visiteds')
// printMap(map, 'prevPos')


shortPathSteps()


printMap(map, 'steps')
console.log({countSteps})