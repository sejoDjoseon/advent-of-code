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

const extractCommon = (comp1: string, comp2: string, comp3: string): string => {
    const list1 = [...comp1]
    const list2 = [...comp2]
    const list3 = [...comp3]
    let common = ""
    list1.every(item => {
        const index2 = list2.findIndex((el) => el === item)
        const index3 = list3.findIndex((el) => el === item)
        if (index2 >= 0 && index3 >= 0) {
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
let group: string[] = []

for (let index = 1; index < lines.length + 1; index++) {
    group.push(lines[index - 1])

    if (index % 3 === 0) {
        const [s1, s2, s3] = group
        const common = extractCommon(s1, s2, s3)
        sumPrios += getPriority(common)
        group = []
    }
}

console.log(sumPrios)