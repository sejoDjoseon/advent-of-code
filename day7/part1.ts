import * as fs from 'fs';
import { EOL } from 'os';

interface File {
    name: string
    size: number
}

class Folder {
    name: string = ''
    files: File[] = []
    folders: Folder[] = []
    parent?: Folder

    getSize(): number {
        let sum = 0
        this.folders.forEach(folders => {
            sum += folders.getSize()
        });
        this.files.forEach(file => {
            sum += file.size
        })
        return sum
    }
}

let lines = fs.readFileSync('input.txt', 'utf-8').split(EOL)

let fileSystem: Folder | undefined = undefined
let currentFolder: Folder | undefined = undefined

const isCommand = (line: string[]): boolean => {
    return line[0] === '$'
}

const isDirectory = (line: string[]): boolean => {
    return line[0] === 'dir'
}

const getCommandAction = (command: 'cd' | 'ls'): ((arg: string) => void) => {
    return {
        'cd': cd,
        'ls': (() => {})
    }[command]
}

const cd = (folder: string) => {
    const newFoder = new Folder()
    newFoder.name = folder
    newFoder.parent = currentFolder

    if (currentFolder === undefined) {
        fileSystem = newFoder
        currentFolder = fileSystem
    } else if (folder === '..') {
        currentFolder = currentFolder.parent
    } else {
        if (!currentFolder.folders.find((f) => f.name === newFoder.name)) {
            currentFolder.folders.push(newFoder)
        }
        currentFolder = newFoder
    }
}

const storeFile = (consoleLine: string[]) => { 
    if (!currentFolder?.files.find((f) => f.name === consoleLine[1])) {
        currentFolder?.files.push({
            name: consoleLine[1],
            size: parseInt(consoleLine[0])
        })
    }
}

lines.forEach(line => {
    const consoleLine = line.split(' ')
    if (isCommand(consoleLine)) {
        consoleLine.shift()
        const commmandName = consoleLine.shift() as 'cd' | 'ls'
        const doAction = getCommandAction(commmandName)
        doAction(consoleLine[0])
    } else {
        if (!isDirectory(consoleLine)) {
            storeFile(consoleLine)
        }
    }
});

let count = 0
const maxSize = 100000

const printFolder = (folder: Folder, deep: number) => {
    const indent = '  '.repeat(deep)
    folder.files.forEach(file => {
        console.log(`${indent}${file.size} ${file.name}`)
    });
    folder.folders.forEach(f => {
        const folderSize = f.getSize()
        if (folderSize <= maxSize) count += folderSize
        console.log(`${indent}${f.name} ${folderSize}`)
        printFolder(f, deep+1)
    });
}

printFolder(fileSystem!, 0)

console.log({count})