import * as fs from "fs";
import { EOL } from "os";

let lines = fs.readFileSync("input.txt", "utf-8").split(`${EOL}`);

function manhattanDistance(pos1: Coordinates, pos2: Coordinates): number {
    return Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y) 
}

interface Coordinates {
    x: number,
    y: number
}

interface Boundaries {
    maxY: number
    minY: number
    maxX: number
    minX: number
}

enum Element {
    Sensor = 'S',
    Beacon = 'B',
    Air = '.'
}

class Beacon {
    position: Coordinates

    constructor(pos: Coordinates) {
        this.position = pos
    }
}

class Sensor {
    position: Coordinates

    closestBeacon: Beacon

    distance: number

    constructor(pos: Coordinates, closestBeacon: Beacon) {
        this.position = pos
        this.closestBeacon = closestBeacon
        this.distance = manhattanDistance(pos, closestBeacon.position)
    }
}

class Map {
    sensors: Sensor[]

    beacons: Beacon[]

    private boundaries: Boundaries

    constructor(sensors: Sensor[]) {
        this.beacons = []
        this.sensors = []

        this.boundaries = {
            maxX: -Infinity,
            maxY: -Infinity,
            minX: Infinity,
            minY: Infinity,
        }

        sensors.forEach(sensor => {
            if (!this.registeredBeacon(sensor.closestBeacon)) {
                this.beacons.push(sensor.closestBeacon)
                this.updateBoundaries(sensor.closestBeacon.position)
            }
            this.sensors.push(sensor)
            this.updateBoundaries(sensor.position)
        });
    }

    printMap() {
        for (let y = this.boundaries.minY; y <= this.boundaries.maxY; y++) {
            for (let x = this.boundaries.minX; x <= this.boundaries.maxX; x++) {
                if (this.beacons.findIndex((b) => b.position.x === x && b.position.y === y) >= 0) {
                    process.stdout.write(Element.Beacon)
                } else if (this.sensors.findIndex(s => s.position.x === x && s.position.y === y) >= 0) {
                    process.stdout.write(Element.Sensor)
                } else {
                    process.stdout.write(Element.Air)
                }
            }
            process.stdout.write(EOL)
        }
    }

    private registeredBeacon(beacon: Beacon): boolean {
        return this.beacons.some(b => 
            b.position.x === beacon.position.x 
            && b.position.y === beacon.position.y)
    }

    private updateBoundaries(pos: Coordinates) {
        this.boundaries.maxX < pos.x && (this.boundaries.maxX = pos.x)
        this.boundaries.maxY < pos.y && (this.boundaries.maxY = pos.y)
        this.boundaries.minX > pos.x && (this.boundaries.minX = pos.x)
        this.boundaries.minY > pos.y && (this.boundaries.minY = pos.y)
    }

    private getLimitsCannotContainInRow(y: number): {left: number, right: number}[] {
        const limits: {left: number, right: number}[] = []
        
        this.sensors.forEach(sensor => {
            const distanceToRow = manhattanDistance(sensor.position, {x: sensor.position.x, y})
            if (distanceToRow <= sensor.distance) {
                const limitSensorAreaOnLine = sensor.distance - distanceToRow
                limits.push({
                    left: sensor.position.x - limitSensorAreaOnLine, 
                    right: sensor.position.x + limitSensorAreaOnLine
                })
            }
        })

        return limits.sort((a, b) => a.left - b.left)
    }

    private positionsCannotContainInRow(y: number): Set<number> {
        const beaconsOnY = this.beacons.filter(b => b.position.y === y)
        const cannotContain = new Set<number>()

        for (let limits of this.getLimitsCannotContainInRow(y)) {
            for(let x = limits.left; x <= limits.right; x++) {
                cannotContain.add(x)
            }
        }

        beaconsOnY.forEach((b) => {
            cannotContain.add(b.position.x)
        })

        return cannotContain
    }

    countPositionsCannotContainInRow(y: number): number {
        const beaconsOnY = this.beacons.filter(b => b.position.y === y)
        return this.positionsCannotContainInRow(y).size - beaconsOnY.length
    }

    findHiddenBeacon(boundaries: Boundaries): Coordinates{
        for (let y = boundaries.minY; y <= boundaries.maxY; y++) {
            let limits = this.getLimitsCannotContainInRow(y)
            let currentInterval = limits[0]
            for (let index = 1; index < limits.length; index++) {
                const limit = limits[index];
                if (currentInterval.right < limit.left) {
                    return {x: currentInterval.right + 1, y}
                }
                const rightLimit = Math.max(currentInterval.right, limit.right)
                currentInterval = {left: currentInterval.left, right: rightLimit}
            }
        }
        return {x: 0, y: 0}
    }
}

function parseLine(line: string): Sensor {
    let matches = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/i)

    const beacon = new Beacon({x: parseInt(matches![3]), y: parseInt(matches![4])})
    const sensor = new Sensor({x: parseInt(matches![1]), y: parseInt(matches![2])}, beacon)

    return sensor
}

function parseInput(lines: string[]): Map {
    const sensors: Sensor[] = []
    lines.forEach(line => {
        sensors.push(parseLine(line))
    })

    return new Map(sensors)
}

const map = parseInput(lines)

// map.printMap()

// console.log({count: map.countPositionsCannotContainInRow(10)})
// console.log({position: map.findHiddenBeacon({minX: 0, minY: 0, maxX: 20, maxY: 20})})
console.log({count: map.countPositionsCannotContainInRow(2000000)})
const position = map.findHiddenBeacon({minX: 0, minY: 0, maxX: 4000000, maxY: 4000000})
console.log({position})
console.log({result: position.x * 4000000 + position.y})
