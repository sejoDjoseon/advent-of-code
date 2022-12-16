import * as fs from "fs";
import { EOL } from "os";

let lines = fs.readFileSync("easy.txt", "utf-8").split(`${EOL}`);

interface Coordinates {
    x: number
    y: number
}

let MAXX = 0
let MAXY = 0
let MINX = Infinity
const MINY = 0

const rockPositions: Coordinates[] = []
const sandSource: Coordinates = {x: 500, y: 0}

function rocksBetween(p1: Coordinates, p2: Coordinates): Coordinates[] {
    const rocks: Coordinates[] = []
    if (p1.x === p2.x) {
        if (p1.y < p2.y) {
            for (let n = p1.y + 1; n <= p2.y; n++) {
                rocks.push({x: p1.x, y: n})
            }
        } else {
            for (let n = p1.y; n >= p2.y; n--) {
                rocks.push({x: p1.x, y: n})
            }
        }
    } else {
        if (p1.x < p2.x) {
            for (let n = p1.x + 1; n <= p2.x; n++) {
                rocks.push({x: n, y: p1.y})
            }
        } else {
            for (let n = p1.x; n >= p2.x; n--) {
                rocks.push({x: n, y: p1.y})
            }
        }
    }
    return rocks
}

lines.forEach(line => {
    const pathPoints: Coordinates[] = line.split(' -> ').map((v) => {
        const [x, y] = v.split(',')
        return {x: parseInt(x), y: parseInt(y)}
    })
    let prevPoint = pathPoints[0]
    rockPositions.push(prevPoint)
    for (let index = 1; index < pathPoints.length; index++) {
        const point = pathPoints[index];
        rockPositions.push(...rocksBetween(prevPoint, point))
        prevPoint = point
    }
})

rockPositions.forEach(point => {
    if (point.x < MINX) MINX = point.x
    if (point.x > MAXX) MAXX = point.x
    if (point.y > MAXY) MAXY = point.y
})

// delimit
const maxY = MAXY - MINY
const maxX = MAXX - MINX

function convertCoords(coords: Coordinates): Coordinates {
    return {x: coords.x - MINX, y: coords.y - MINY}
}

enum Element {
    Source = '+',
    Air = '.',
    Rock = '#',
    Sand = 'o'
}

const map: Element[][] = []
for (let y = 0; y <= maxY; y++) {
    const row: Element[] = []
    for (let x = 0; x <= maxX; x++) {
        row.push(Element.Air)
    }
    map.push(row)
    
}

const printMap = (map: Element[][]) => {
    let count = 0
    map.forEach(row => {
        row.forEach(p => {
            if (p === Element.Sand) count++
            process.stdout.write(p)
        })
        process.stdout.write(EOL)
    })
    console.log({count})
}

rockPositions.forEach(r => {
    const c = convertCoords(r)
    map[c.y][c.x] = Element.Rock
})
const convertedSandSource = convertCoords(sandSource)
map[convertedSandSource.y][convertedSandSource.x] = Element.Source

function isOutOfMap({x ,y}: Coordinates): boolean {
    return y > maxY || x > maxX || x < 0
}

let fallsForever = false

const fallUnit = () => {
    let unitPosition: Coordinates = convertedSandSource
    let end = false
    while (!end) {
        let nextPosition = {...unitPosition, y: unitPosition.y + 1}
        if (isOutOfMap(nextPosition)) {
            fallsForever = true
            end = true
        } else {
            if (map[nextPosition.y][nextPosition.x] !== Element.Air) {
                nextPosition = {...nextPosition, x: nextPosition.x - 1}
                if (isOutOfMap(nextPosition)) {
                    fallsForever = true
                    end = true
                } else {
                    if (map[nextPosition.y][nextPosition.x] !== Element.Air) {
                        nextPosition = {...nextPosition, x: nextPosition.x + 2}
                        if (isOutOfMap(nextPosition)) {
                            fallsForever = true
                            end = true
                        } else {
                            if (map[nextPosition.y][nextPosition.x] !== Element.Air) {
                                end = true
                            } else {
                                unitPosition = nextPosition
                            }
                        }
                    } else {
                        unitPosition = nextPosition
                    }
                }
            } else {
                unitPosition = nextPosition
            }
        }
    }
    !fallsForever && (map[unitPosition.y][unitPosition.x] = Element.Sand)
}

let sandUnitsCount = 0

while(!fallsForever) {
    fallUnit()
}

printMap(map)

console.log({sandUnitsCount})