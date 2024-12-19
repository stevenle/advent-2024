/** https://adventofcode.com/2024/day/6 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parse() {
  // const txt = fs.readFileSync(path.join(__dirname, 'example.txt'), 'utf-8');
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  return txt.trimEnd();
}

function main() {
  // part1();  // 41
  part2();  // 1831
}

function part1() {
  const txt = parse();
  const graph = new Graph(txt);
  graph.patrol();
  const res = graph.numVisitedNodes();
  console.log(graph.toString());
  console.log(res);
}

function part2() {
  const txt = parse();
  const graph = new Graph(txt);
  let res = 0;

  const ymax = graph.grid.length;
  const xmax = graph.grid[0].length;
  for (let y = 0; y < ymax; y++) {
    for (let x = 0; x < xmax; x++) {
      graph.reset();
      const node = graph.getNode(x, y);
      if (!node.obstacle && !node.visited) {
        try {
          node.obstacle = true;
          node.injected = true;
          graph.patrol();
        } catch (err) {
          if (err.looping) {
            console.log('\n--\n');
            console.log(graph.toString());
            res += 1;
          } else {
            throw err;
          }
        }
      }
    }
  }

  console.log();
  console.log(res);
}

class Graph {
  constructor(txt) {
    this.txt = txt;
    this.initGrid(txt);
  }

  initGrid(txt) {
    this.grid = [];
    this.guard = new Guard();
    const lines = txt.split('\n');
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      const row = [];
      for (let x = 0; x < line.length; x++) {
        const ch = line[x];
        const node = new Node();
        if (ch === '#') {
          node.obstacle = true;
        } else if (ch === '^') {
          this.guard.move(x, y);
          this.guard.dir = Direction.UP;
          node.visited = true;
        }
        row.push(node);
      }
      this.grid.push(row);
    }
  }

  reset() {
    this.initGrid(this.txt);
  }

  patrol() {
    const visitedDirections = new Set();
    const guardDirectionId = () => {
      return `${this.guard.x},${this.guard.y},${this.guard.dir.toString()}`;
    }
    while (this.isInBounds(this.guard.x, this.guard.y)) {
      const dirId = guardDirectionId();
      if (visitedDirections.has(dirId)) {
        const err = new Error('guard is stuck in a loop');
        err.looping = true;
        throw err;
      }
      visitedDirections.add(dirId);

      const [x, y] = this.guard.next();
      const node = this.getNode(x, y);
      if (!node) {
        this.guard.move(x, y);
      } else if (node.obstacle) {
        this.guard.turn();
      } else {
        this.guard.move(x, y);
        node.visited = true;
      }
    }
  }

  getNode(x, y) {
    if (!this.isInBounds(x, y)) {
      return null;
    }
    return this.grid[y][x];
  }

  numVisitedNodes() {
    let count = 0;
    this.grid.forEach((row) => {
      row.forEach((node) => {
        if (node.visited) {
          count += 1;
        }
      });
    });
    return count;
  }

  isInBounds(x, y) {
    const ymax = this.grid.length;
    const xmax = this.grid[0].length;
    return x >= 0 && x < xmax && y >= 0 && y < ymax;
  }

  forEach(cb) {
    this.grid.forEach((row, y) => {
      this.row.forEach((node, x) => {
        cb(node, x, y);
      });
    });
  }

  toString() {
    const lines = this.grid.map((row, y) => {
      const line = row.map((node, x) => {
        if (this.guard.x === x && this.guard.y === y) {
          return this.guard.toString();
        }
        return node.toString();
      });
      return line.join('');
    });
    return lines.join('\n');
  }
}

class Node {
  constructor(ch) {
    this.obstacle = false;
    this.visited = false;
    this.injected = false;
  }

  toString() {
    if (this.obstacle && this.injected) {
      return 'O';
    }
    if (this.obstacle) {
      return '#';
    }
    if (this.visited) {
      return 'X';
    }
    return '.';
  }
}

class Guard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dir = Direction.UP;
  }

  next() {
    return this.dir.next(this.x, this.y);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  turn() {
    this.dir = this.dir.turn();
  }

  toString() {
    return this.dir.toString();
  }
}

const Direction = {
  UP: {
    next: (startX, startY) => [startX, startY - 1],
    turn: () => Direction.RIGHT,
    toString: () => '^',
  },
  DOWN: {
    next: (startX, startY) => [startX, startY + 1],
    turn: () => Direction.LEFT,
    toString: () => 'V',
  },
  LEFT: {
    next: (startX, startY) => [startX - 1, startY],
    turn: () => Direction.UP,
    toString: () => '<',
  },
  RIGHT: {
    next: (startX, startY) => [startX + 1, startY],
    turn: () => Direction.DOWN,
    toString: () => '>',
  },
};

main();
