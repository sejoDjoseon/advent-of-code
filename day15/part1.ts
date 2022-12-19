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

    countPositionsCannotContainInRow(y: number): number {
        const beaconsOnY = this.beacons.filter(b => b.position.y === y).length
        const cannotContain = new Set()

        this.sensors.forEach(sensor => {
            const distanceToRow = manhattanDistance(sensor.position, {x: sensor.position.x, y})
            if (distanceToRow <= sensor.distance) {
                const limitSensorAreaOnLine = sensor.distance - distanceToRow
                for (
                    let x = sensor.position.x - limitSensorAreaOnLine; 
                    x <= sensor.position.x + limitSensorAreaOnLine; 
                    x++
                ) {
                    cannotContain.add(x)
                }
            }
        })

        return cannotContain.size - beaconsOnY
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

console.log({count: map.countPositionsCannotContainInRow(2000000)})

