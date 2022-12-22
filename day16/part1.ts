import * as fs from "fs";
import { EOL } from "os";

interface Node {
    name: string,
    value: number
}

enum Movements {
    Move = 'move to',
    Open = 'open',
    Nothing = 'do nothing'
}

interface Movement {
    mov: Movements
    valve?: string
}

class Graph {
    nodesNum = 0
    names = new Map<number, string>()
    indexes = new Map<string, number>()
    adjacencyList = new Map<string, string[]>()
    values = new Map<string, number>()
    opened = new Map<string, boolean>()
    distances: number[][] = []
    next: string[][] = []
  
    addVertex(node: Node) {
      this.adjacencyList.set(node.name, [])
      this.values.set(node.name, node.value)
      this.names.set(this.nodesNum, node.name)
      this.indexes.set(node.name, this.nodesNum)
      this.opened.set(node.name, false)
      this.nodesNum++
    }
  
    addEdge(src: string, dest: string) {
      this.adjacencyList.get(src)?.push(dest);
    }

    // Floy-Warshall algorithm
    explore() {
        let dist = new Array(this.nodesNum)
        let next = new Array(this.nodesNum)
        for (let index = 0; index < this.nodesNum; index++) {
            dist[index] = new Array(this.nodesNum).fill(Infinity)
            next[index] = new Array(this.nodesNum)
        }

        for (let i = 0; i < this.nodesNum; i++) {
            const nodeName = this.names.get(i)!
            const adl = this.adjacencyList.get(nodeName)!
            adl.forEach(nodeU => {
                const indexU = this.indexes.get(nodeU)!
                dist[i][indexU] = 1
                next[i][indexU] = nodeU
            })
            dist[i][i] = 0
            next[i][i] = nodeName
        }

        for (let k = 0; k < this.nodesNum; k++) {
            for (let i = 0; i < this.nodesNum; i++) {
                for (let j = 0; j < this.nodesNum; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j]
                        next[i][j] = next[i][k]
                    }
                }
            }
        }

        this.distances = dist
        this.next = next
    }

    distanceBetween(node1: string, node2: string): number {
        const index1 = this.indexes.get(node1)!
        const index2 = this.indexes.get(node2)!

        return this.distances[index1][index2]
    }

    doMovement(currentNode: string, minutes: number): Movement {
        const notOpenedNodes: string[] = []
        this.opened.forEach((opened, node) => {
            if (!opened && this.values.get(node)! > 0) {
                notOpenedNodes.push(node)
            }
        })
        const {n: bestNode} = this.dfs(currentNode, notOpenedNodes, minutes)

        if (!!bestNode) {
            if (bestNode === currentNode) {
                this.opened.set(currentNode, true)
                return {mov: Movements.Open, valve: currentNode}
            } {
                const nextNode = this.next[this.indexes.get(currentNode)!][this.indexes.get(bestNode)!]
                return {mov: Movements.Move, valve: nextNode}
            }
        }

        return {mov: Movements.Nothing}
    }

    dfs(currentNode: string, notOpenedNodes: string[], minutes: number): {h: number, n?: string} {
        const currentIndex = this.indexes.get(currentNode)!
        let heuristicResult = 0
        let bestNode: string | undefined
        for (let node of notOpenedNodes) {
            const i = this.indexes.get(node)!
            const distance = this.distances[currentIndex][i]
            const valueNode = this.values.get(node)!
            const minRemain = minutes - distance - 1
            const heuristic = minRemain * valueNode 
                + (minRemain > 0 ? this.dfs(node, notOpenedNodes.filter(v => v !== node), minRemain).h : 0)
            if (heuristic > heuristicResult) {
                heuristicResult = heuristic
                bestNode = node
            }
        }

        return {h: heuristicResult, n: bestNode}
    }

    valueReleased(): number {
        let result = 0
        this.opened.forEach((opened, node) => {
            if (opened) result += this.values.get(node)!
        })

        return result
    }
}  

const graph: Graph = fs.readFileSync("input.txt", "utf-8").split(`${EOL}`).map(line => {
    const regex = /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/ig
    let [_, valve, flowRate, tunnels] = regex.exec(line)!
    return {valve, flowRate: parseInt(flowRate), tunnels:  tunnels.split(", ")}
}).reduce((graph, {valve, flowRate, tunnels}) => {
    graph.addVertex({name: valve, value: flowRate})
    for (let tun of tunnels) {
        graph.addEdge(valve, tun)
    }
    return graph
}, new Graph())

graph.explore()

let currentValve = "AA"
let totalReleased = 0
for (let min = 30; min > 0; min--) {
    const releasedThisTurn = graph.valueReleased()
    totalReleased += releasedThisTurn
    const {mov, valve} = graph.doMovement(currentValve, min)
    !!valve && (currentValve = valve)
    console.log({min, mov, valve, releasedThisTurn})
}

console.log({totalReleased})