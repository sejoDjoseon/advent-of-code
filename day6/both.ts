import * as fs from 'fs';
import { EOL } from 'os';

type stack = string[]

const data = fs.readFileSync('input.txt', 'utf-8')

let header: string[] = []

for (let index = 0; index < data.length; index++) {
    const element = data[index];
    
    const position = header.findIndex((he) => he === element )
    if (position > -1) {
        header.splice(0, position + 1)
    }
    
    header.push(element)

    if (header.length === 14) {
        console.log({result: index+1})
        break;
    }
}
