import * as fs from "fs";
import { EOL } from "os";

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

const allLines: any[] = []

packets.forEach(packet => {
    const {first, second} = packet
    allLines.push(first, second)
})

allLines.push([[2]], [[6]])

allLines.sort((first, second) => {
    const comp = compare(
        JSON.parse(JSON.stringify(first)), 
        JSON.parse(JSON.stringify(second))
    )
    if (comp === undefined) {
        return 0
    } else if (!comp) {
        return 1
    } else {
        return -1
    }
})

let dividerIndex1, dividerIndex2 = 0

dividerIndex1 = allLines.findIndex((a) => JSON.stringify(a) === '[[2]]') +1
dividerIndex2 = allLines.findIndex((a) => JSON.stringify(a) === '[[6]]') +1

console.log(dividerIndex1 * dividerIndex2)