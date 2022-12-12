import * as fs from "fs";
import { EOL } from "os";

enum ProductOperation {
    Product = '*',
    Add = '+'
}

function getOperationFunc(po: ProductOperation): ((a: number, b: number) => number) {
    return {
        [ProductOperation.Add]: (a: number, b: number) => a + b,
        [ProductOperation.Product]: (a: number, b: number) => a * b
    }[po]
}

type Pass = { item: number, throwTo: number }

interface MonkeyI {
    id: number
    items: number[]
    worryOperation: ProductOperation
    worryBy: number
    divisibleTest: number
    targetIfTrue: number
    targetIfFalse: number
}

interface Monkey extends MonkeyI { }

class Monkey {
    private inspectedItemsCount = 0

    constructor(m: MonkeyI) {
        this.id = m.id
        this.items = m.items
        this.worryOperation = m.worryOperation
        this.worryBy = m.worryBy
        this.divisibleTest = m.divisibleTest
        this.targetIfTrue = m.targetIfTrue
        this.targetIfFalse = m.targetIfFalse
    }

    private evaluateWorryLevel(item: number): number {
        const secondParam = this.worryBy === 0 ? item : this.worryBy
        const newItem = getOperationFunc(this.worryOperation)(item, secondParam)
        return newItem % 9699690
    }

    private decideMonkeyToThrow(item: number): number {
        return item % this.divisibleTest === 0 ? this.targetIfTrue : this.targetIfFalse
    }

    action(): Pass[] {
        const thownItems: Pass[] = []
        let item = this.items.shift()
        while (!!item) {
            this.inspectedItemsCount++
            const newItem = this.evaluateWorryLevel(item)
            const throwTo = this.decideMonkeyToThrow(newItem)
            thownItems.push({ item: newItem, throwTo })
            item = this.items.shift()
        }
        return thownItems
    }

    recieveItem(item: number) {
        this.items.push(item)
    }

    getCountInspectedItems(): number {
        return this.inspectedItemsCount
    }
}

function parseLine1(line: string): { id: number } {
    const idS = line.match(/\d+/)
    if (idS) {
        return { id: parseInt(idS[0]) }
    } else {
        return { id: 0 }
    }
}

function parseLine2(line: string): { items: number[] } {
    const items = line.match(/\d+/g)
    if (items) {
        return { items: items.map((item) => parseInt(item)) }
    } else {
        return { items: [] }
    }
}

function parseLine3(line: string): { worryOperation: ProductOperation, worryBy: number } {
    const by = line.match(/\d+/) || '0'
    const operator = line.match(/[*+]/)
    if (!!operator) {
        return {
            worryOperation: operator[0] as ProductOperation,
            worryBy: parseInt(by[0])
        }
    } else {
        return { worryOperation: ProductOperation.Add, worryBy: 0 }
    }
}

function parseLine456(line: string): number {
    const v = line.match(/\d+/)
    if (v) {
        return parseInt(v[0])
    } else {
        return 0
    }
}

function parseMonkeyNotes(notes: string): MonkeyI {
    const lines = notes.split(EOL)
    return {
        ...parseLine1(lines[0]),
        ...parseLine2(lines[1]),
        ...parseLine3(lines[2]),
        divisibleTest: parseLine456(lines[3]),
        targetIfTrue: parseLine456(lines[4]),
        targetIfFalse: parseLine456(lines[5])
    }
}

let monkeyNotes = fs.readFileSync("input.txt", "utf-8").split(`${EOL}${EOL}`);

const monkeyList: Monkey[] = []

monkeyNotes.forEach(notes => {
    monkeyList.push(new Monkey(parseMonkeyNotes(notes)))

});

for (let index = 0; index < 10000; index++) {
    monkeyList.forEach(monkey => {
        const passes = monkey.action()
        passes.forEach(pass => {
            const reciever = monkeyList.find(m => m.id === pass.throwTo)
            reciever!.recieveItem(pass.item)
        });
    })
}

console.log(monkeyList)

monkeyList.sort((a, b) => b.getCountInspectedItems() - a.getCountInspectedItems())


console.log(monkeyList[0].getCountInspectedItems() * monkeyList[1].getCountInspectedItems())