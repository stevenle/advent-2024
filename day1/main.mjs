/** https://adventofcode.com/2024/day/1 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function part1() {
  const lines = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').split('\n');
  const list1 = [];
  const list2 = [];

  let len = 0;
  for (const line of lines) {
    if (!line) {
      break;
    }
    const [n1, n2] = line.split(/\s+/).map((s) => parseInt(s));
    list1.push(n1);
    list2.push(n2);
    len += 1;
  }

  list1.sort();
  list2.sort();
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.abs(list1[i] - list2[i]);
  }
  console.log(sum);
}

function part2() {
  const lines = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8').trimEnd().split('\n');
  const list1 = [];
  const list2Freq = {};

  for (const line of lines) {
    const [n1, n2] = line.split(/\s+/).map((s) => parseInt(s));
    list1.push(n1);
    const count = list2Freq[n2] || 0;
    list2Freq[n2] = count + 1;
  }

  let sum = 0;
  for (const num of list1) {
    sum += num * (list2Freq[num] || 0);
  }
  console.log(sum);
}

function main() {
  part2();
}

main();
