import fs from 'fs'
import path from 'path'
import {parse} from './parser.js'

const getContentFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(absolutePath, 'utf-8');
}
const genDiff = (filepath1, filepath2) => {
  const content1 = getContentFile(filepath1)
  const content2 = getContentFile(filepath2)
  const parse1 = parse(content1)
  const parse2 = parse(content2)
  return {
    parse1,
    parse2
  }
}

console.log(genDiff('../fixtures/file1.json', '../fixtures/file2.json'))
export default genDiff


