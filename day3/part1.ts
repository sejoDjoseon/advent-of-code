import * as fs from 'fs';
import { EOL } from 'os';

const getPriority = (item: string): number => {
    let priority = 0
    if (isUpperCase(item)) {
        priority = item.charCodeAt(0) - "A".charCodeAt(0) + 27
    } else {
        priority = item.charCodeAt(0) - "a".charCodeAt(0) + 1
    }
    return priority
}

const extractCommon = (comp1: string, comp2: string): string => {
    const list1 = [...comp1]
    const list2 = [...comp2]
    let common = ""
    list1.every(item => {
        const index = list2.findIndex((el) => el === item)
        if (index >= 0) {
            common = item
            return false
        }
        return true
    });
    if (common === "") console.log("error extract comon")
    return common
}

const isUpperCase = (c: string) => {
    return !(c.charCodeAt(0) >= "a".charCodeAt(0))
}

const lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)
let sumPrios = 0

lines.forEach(line => {
    const middle = line.length/2
    const s1 = line.substring(0, middle) 
    const s2 = line.substring(middle)
    const common = extractCommon(s1, s2)
    sumPrios += getPriority(common)
});

console.log(sumPrios)