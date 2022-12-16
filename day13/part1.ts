import * as fs from "fs";
import { EOL, type } from "os";

let packetLines = fs.readFileSync("input.txt", "utf-8").split(`${EOL}${EOL}`);

interface Packet {
    first: any[]
    second: any[]
}

const packets: Packet[] = []

packetLines.forEach(packetLine => {
    const [first, second] = packetLine.split(EOL).map(v => JSON.parse(v))
    packets.push({first, second})
});

const rightOrderPackets: number[] = []

function compareNumbers(n1: number, n2: number): boolean | undefined {
    if (n1 < n2) {
        return true
    }
    if (n1 > n2) {
        return false
    }
    return undefined
}

function compare(first: any[], second: any[]): boolean | undefined {
    let v1 = first.shift()
    let v2 = second.shift()

    while (v1 !== undefined && v2 !== undefined) {
        let result: boolean | undefined
        if (typeof v1 === 'object') {
            if (typeof v2 === 'object') {
                result = compare(v1, v2)
            } else if (typeof v2 === 'number') {
                result = compare(v1, [v2])
            }
        } else if (typeof v1 === 'number') {
            if (typeof v2 === 'object') {
                result = compare([v1], v2)
            } else if (typeof v2 === 'number') {
                result = compareNumbers(v1, v2)
            }
        }
        
        if (result !== undefined) {
            return result
        }

        v1 = first.shift()
        v2 = second.shift()
    }

    if (v1 === undefined && v2 === undefined) {
        return undefined
    }
    if (v1 === undefined) {
        return true
    }

    return false
}

packets.forEach((packet, index) => {
    const {first, second} = packet
    console.log({first, second})
    const result = compare(first, second)
    console.log(result)
    if (result || result === undefined) {
        rightOrderPackets.push(index + 1)
    }
});

const indexesSum = rightOrderPackets.reduce(
    (prevValue, currValue) => prevValue + currValue, 0
)

console.log({ indexesSum })