/** https://adventofcode.com/2024/day/7 */

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
  // part1();  // 3749
  part2();  // 145149066755184
}

function part1() {
  const txt = parse();
  const lines = txt.split('\n');
  let sum = 0;
  for (const line of lines) {
    const segments = line.split(': ');
    const val = parseInt(segments[0]);
    const nums = segments[1].split(' ').map((s) => parseInt(s));
    if (check1(val, nums)) {
      sum += val;
    }
  }
  console.log(sum);
}

function check1(val, nums) {
  let levelNodes = [new Node(nums[0])];
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const newNodes = [];
    for (const node of levelNodes) {
      const plusVal = node.val + num;
      if (val >= plusVal) {
        newNodes.push(new Node(plusVal));
      }
      const multVal = node.val * num;
      if (val >= multVal) {
        newNodes.push(new Node(multVal));
      }
    }
    levelNodes = newNodes;
  }
  for (const node of levelNodes) {
    if (node.val === val) {
      return true;
    }
  }
  return false;
}

function part2() {
  const txt = parse();
  const lines = txt.split('\n');
  let sum = 0;
  for (const line of lines) {
    const segments = line.split(': ');
    const val = parseInt(segments[0]);
    const nums = segments[1].split(' ').map((s) => parseInt(s));
    if (check2(val, nums)) {
      sum += val;
    }
  }
  console.log(sum);
}

function check2(val, nums) {
  let levelNodes = [new Node(nums[0])];
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const newNodes = [];
    for (const node of levelNodes) {
      const plusVal = node.val + num;
      if (val >= plusVal) {
        newNodes.push(new Node(plusVal));
      }
      const multVal = node.val * num;
      if (val >= multVal) {
        newNodes.push(new Node(multVal));
      }
      const concatVal = parseInt(String(node.val) + String(num));
      if (val >= concatVal) {
        newNodes.push(new Node(concatVal));
      }
    }
    levelNodes = newNodes;
  }
  for (const node of levelNodes) {
    if (node.val === val) {
      return true;
    }
  }
  return false;
}

class Node {
  constructor(val) {
    this.val = val;
  }
}

main();
