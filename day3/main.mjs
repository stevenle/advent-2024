/** https://adventofcode.com/2024/day/3 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RE = /mul\(\d\d?\d?,\d\d?\d?\)/g;

function main() {
  part2();
}

const Action = {
  DO: 'do',
  DONT: 'dont',
  MUL: 'mul',
};

function part1() {
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  const res = Array.from(txt.matchAll(RE));
  let sum = 0;
  for (const item of res) {
    const [n1, n2] = item[0].slice(4, -1).split(',').map((s) => parseInt(s));
    sum += n1 * n2;
  }
  console.log(sum);
}

function part2() {
  const txt = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf-8');
  let ptr = 0;
  let enabled = true;
  let sum = 0;

  function peek(len = 1) {
    const endIndex = ptr + len;
    if (endIndex >= txt.length) {
      return null;
    }
    return txt.slice(ptr, endIndex);
  }

  function peekWord(word) {
    return peek(word.length) === word;
  }

  function readMul() {
    if (peekWord('mul(')) {
      ptr += 4;
      const n1 = nextNum();
      if (n1 === null) {
        return null;
      }
      const sep = peek();
      if (sep !== ',') {
        return null;
      }
      ptr += 1;
      const n2 = nextNum();
      if (n2 === null) {
        return null;
      }
      const term = peek();
      if (term !== ')') {
        return null;
      }
      ptr += 1;
      return [n1, n2];
    }
  }

  function nextNum() {
    let value = nextDigit();
    if (value === null) {
      return value;
    }
    let digit = nextDigit();
    while (digit !== null) {
      value = value * 10 + digit;
      digit = nextDigit();
    }
    return value;
  }

  function nextDigit() {
    const ch = peek();
    if (!isDigit(ch)) {
      return null;
    }
    ptr += 1;
    return parseInt(ch);
  }

  function nextInstruction() {
    let ch = peek();
    while (ch !== 'd' && ch !== 'm') {
      if (ch === null) {
        return null;
      }
      ptr += 1;
      ch = peek();
    }
    if (ch === 'd') {
      if (peekWord("don't()")) {
        enabled = false;
        ptr += 7;
        return {action: Action.DONT};
      }
      if (peekWord('do()')) {
        enabled = true;
        ptr += 4;
        return {action: Action.DO};
      }
    } else if (ch === 'm') {
      const inputs = readMul();
      if (inputs) {
        return {action: Action.MUL, inputs: inputs};
      }
    }
    ptr += 1;
    return nextInstruction();
  }

  while (true) {
    const inst = nextInstruction();
    if (!inst) {
      break;
    }
    if (inst.action === Action.DO) {
      enabled = true;
    } else if (inst.action === Action.DONT) {
      enabled = false;
    } else if (inst.action === Action.MUL) {
      if (enabled) {
        sum += inst.inputs[0] * inst.inputs[1];
      }
    }
  }
  console.log(sum);
}

function isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

main();
