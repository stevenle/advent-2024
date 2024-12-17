/** https://adventofcode.com/2024/day/2 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  const lines = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').trimEnd().split('\n');
  let numSafe = 0;
  lines.forEach((line) => {
    const levels = line.split(/\s+/).map((s) => parseInt(s));
    if (isSafeWithDampener(levels)) {
      numSafe += 1;
    }
  });
  console.log(numSafe);
}

const SAFE_MIN = 1;
const SAFE_MAX = 3;

const DECREASING = -1;
const INCREASING = 1;

function isSafeWithDampener(levels) {
  const reactor = new Reactor(levels);
  if (reactor.check().safe) {
    return true;
  }
  for (let i = 0; i < levels.length; i++) {
    reactor.dampen(i);
    if (reactor.check().safe) {
      return true;
    }
  }
  return false;
}

class Reactor {
  dampenedIndex = -1;

  constructor(levels) {
    this.levels = levels;
  }

  dampen(index) {
    this.dampenedIndex = index;
  }

  check() {
    let p1 = 0;
    let p2 = 1;
    let direction = 0;
    while (true) {
      if (p2 >= this.levels.length) {
        break;
      }
      if (p1 === p2) {
        p2 += 1;
        continue;
      }
      if (p1 === this.dampenedIndex) {
        p1 += 1;
        continue;
      }
      if (p2 === this.dampenedIndex) {
        p2 += 1;
        continue;
      }
      const l1 = this.levels[p1];
      const l2 = this.levels[p2];
      const diff = l2 - l1;
      const absDiff = Math.abs(diff);
      if (absDiff < SAFE_MIN || absDiff > SAFE_MAX) {
        return {safe: false, indexes: [p1, p2], levels: this.levels, dampened: this.dampenedIndex};
      }
      if (direction === 0) {
        direction = diff < 0 ? DECREASING : INCREASING;
      } else {
        if (direction === DECREASING && diff > 0) {
          return {safe: false, indexes: [p1, p2], levels: this.levels, dampened: this.dampenedIndex};
        }
        if (direction === INCREASING && diff < 0) {
          return {safe: false, indexes: [p1, p2], levels: this.levels, dampened: this.dampenedIndex};
        }
      }
      p1 += 1;
      p2 += 1;
    }
    return {safe: true, levels: this.levels, dampened: this.dampenedIndex};
  }
}


main();
