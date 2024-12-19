/** https://adventofcode.com/2024/day/3 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function main() {
  part2();
}

const Direction = {
  LEFT: {
    dx: (x) => x - 1,
    dy: (y) => y,
  },
  RIGHT: {
    dx: (x) => x + 1,
    dy: (y) => y,
  },
  TOP: {
    dx: (x) => x,
    dy: (y) => y - 1,
  },
  BOTTOM: {
    dx: (x) => x,
    dy: (y) => y + 1,
  },
  TOP_LEFT: {
    dx: (x) => x - 1,
    dy: (y) => y - 1,
  },
  TOP_RIGHT: {
    dx: (x) => x + 1,
    dy: (y) => y - 1,
  },
  BOTTOM_LEFT: {
    dx: (x) => x - 1,
    dy: (y) => y + 1,
  },
  BOTTOM_RIGHT: {
    dx: (x) => x + 1,
    dy: (y) => y + 1,
  },
}

function part1() {
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  const lines = txt.trimEnd().split('\n');
  const numLines = lines.length;
  const numChars = lines[0].length;
  let result = 0;

  function check(x, y, dir, word) {
    if (!word) {
      return true;
    }
    if (x >= 0 && x < numChars && y >= 0 && y < numLines && lines[y][x] === word.at(0)) {
      return check(dir.dx(x), dir.dy(y), dir, word.slice(1));
    }
    return false;
  }

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === 'X') {
        Object.values(Direction).forEach((dir) => {
          if (check(x, y, dir, 'XMAS')) {
            result += 1;
          }
        });
      }
    }
  }

  console.log(result);
}

function part2() {
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  const lines = txt.trimEnd().split('\n');
  const numLines = lines.length;
  const numChars = lines[0].length;
  let result = 0;

  function getLetter(startX, startY, dir) {
    const x = dir.dx(startX);
    const y = dir.dy(startY);
    if (x >= 0 && x < numChars && y >= 0 && y < numLines) {
      return lines[y][x];
    }
    return '';
  }

  function getCrossWords(x, y) {
    const ch = lines[y][x];
    return [
      getLetter(x, y, Direction.TOP_LEFT) + ch + getLetter(x, y, Direction.BOTTOM_RIGHT),
      getLetter(x, y, Direction.TOP_RIGHT) + ch + getLetter(x, y, Direction.BOTTOM_LEFT),
    ];
  }

  function isMas(word) {
    return word === 'MAS' || word === 'SAM';
  }

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === 'A') {
        const [word1, word2] = getCrossWords(x, y);
        if (isMas(word1) && isMas(word2)) {
          result += 1;
        }
      }
    }
  }

  console.log(result);
}

main();
