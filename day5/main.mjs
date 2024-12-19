/** https://adventofcode.com/2024/day/5 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  part2();
}

function part1() {
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  const lines = txt.trimEnd().split('\n');
  const graph = new Graph();
  let sum = 0;

  for (const line of lines) {
    if (!line) {
      continue;
    }
    if (line.includes('|')) {
      const [node1, node2] = line.split('|');
      graph.addEdge(node1, node2);
    } else if (line.includes(',')) {
      const nodes = line.split(',');
      try {
        const checked = [];
        for (const node of nodes) {
          if (checked.length === 0) {
            checked.push(node);
            continue;
          }

          const edges = graph.edges[node] || {};
          for (const edge of Array.from(edges)) {
            if (checked.includes(edge)) {
              throw new Error(`${edge} should be after ${node}`);
            }
          }
          checked.push(node);
        }
        const middleIndex = Math.floor(nodes.length / 2);
        const middleNum = nodes[middleIndex];
        sum += parseInt(middleNum);
      } catch (err) {
        console.log('--');
        console.log('input:', nodes);
        console.log(`error: ${err.message}`);
      }
    }
  }
  console.log(sum);
}

function part2() {
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  const lines = txt.trimEnd().split('\n');
  const graph = new Graph();
  let sum = 0;

  function reorder(nodes) {
    const nodeSet = new Set(nodes);
    const innerGraph = new Graph();
    for (const node of nodes) {
      const edges = graph.edges[node] || {};
      for (const edge of Array.from(edges)) {
        if (nodeSet.has(edge)) {
          innerGraph.addEdge(node, edge);
        }
      }
    }

    let res = null;
    for (const node of nodes) {
      const order = innerGraph.sort(node);
      if (res) {
        if (order[0] !== res[0]) {
          if (order.includes(res[0])) {
            res = order;
          }
        }
      } else {
        res = order;
      }
    }
    if (res.length !== nodes.length) {
      throw new Error(`res ${res.length} !== nodes ${nodes.length}`);
    }
    return res;
  }

  for (const line of lines) {
    if (!line) {
      continue;
    }
    if (line.includes('|')) {
      const [node1, node2] = line.split('|');
      graph.addEdge(node1, node2);
    } else if (line.includes(',')) {
      const nodes = line.split(',');
      try {
        const checked = [];
        for (const node of nodes) {
          if (checked.length === 0) {
            checked.push(node);
            continue;
          }

          const edges = graph.edges[node] || {};
          for (const edge of Array.from(edges)) {
            if (checked.includes(edge)) {
              const err = new Error(`${edge} should be after ${node}`);
              err.checked = checked;
              err.node = node;
              throw err;
            }
          }
          checked.push(node);
        }
      } catch (err) {
        console.log('--');
        console.log('input:', nodes);
        console.log(`error: ${err.message}`);
        const newOrder = reorder(nodes);
        console.log(newOrder);
        const middleIndex = Math.floor(newOrder.length / 2);
        const middleNum = newOrder[middleIndex];
        sum += parseInt(middleNum);
      }
    }
  }
  console.log(sum);

}

class Graph {
  constructor() {
    this.edges = {};
  }

  addEdge(node1, node2) {
    if (!this.edges[node1]) {
      this.edges[node1] = new Set();
    }
    this.edges[node1].add(node2);
  }

  sort(node) {
    const resultSet = new Set();
    this.visit(node, resultSet);
    return Array.from(resultSet).reverse();
  }

  visit(node, resultSet, visitedSet) {
    if (!visitedSet) {
      visitedSet = new Set();
    }
    if (visitedSet.has(node)) {
      throw new Error(`detected cycle in graph: ${Array.from(visitedSet)} -> ${node}`);
    }
    visitedSet.add(node);
    const nodeEdges = this.edges[node];
    if (!nodeEdges) {
      resultSet.add(node);
      return;
    }
    for (const edge of Array.from(nodeEdges)) {
      this.visit(edge, resultSet, new Set(Array.from(visitedSet)));
    }
    resultSet.add(node);
  }
}

main();
