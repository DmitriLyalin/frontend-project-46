import fs from 'fs'
import path from 'path'
import {parse} from './parser.js'
import _ from 'lodash'

const buildDiff = (obj1,obj2) => {
const keys1 = _.keys(obj1)
   const keys2 = _.keys(obj2)
  

const keysMutualSorted = (_.union(keys1, keys2)).toSorted()

return keysMutualSorted.reduce((accumulator ,key) => {
  if (obj1[key] === obj2[key]) {
   accumulator.push( { key, type: 'unchanged', value: obj1[key] })
  }
  else if (_.has(obj1, key) && (_.has(obj2, key))) {
    accumulator.push( { key, type: 'changed', oldValue: obj1[key], newValue: obj2[key] })
  }
    else if (_.has(obj1, key) && (!_.has(obj2, key))) {
   accumulator.push( { key, type: 'deleted', value: obj1[key] })
  }
  else if (!_.has(obj1, key) && (_.has(obj2, key))) {
    accumulator.push( { key, type: 'added', value: obj2[key] })
  }
 
  return accumulator;
}, [])
}
const format = (diff) => {
  const result = diff.flatMap((item) => {
    if (item.type === 'unchanged') {
      return `  ${item.key}: ${item.value}`;
    }
    if (item.type === 'changed') {
      return [`- ${item.key}: ${item.oldValue}`, `+ ${item.key}: ${item.newValue}`];
    }
    if (item.type === 'deleted') {
      return `- ${item.key}: ${item.value}`;
    } if (item.type === 'added') {
      return `+ ${item.key}: ${item.value}`;
    } 
   
})
return `{\n${result.join('\n')}\n}`
}
const getContentFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(absolutePath, 'utf-8');
}
const genDiff = (filepath1, filepath2) => {
  const content1 = getContentFile(filepath1)
  const content2 = getContentFile(filepath2)
  const parse1 = parse(content1)
  const parse2 = parse(content2)
  const diff = buildDiff(parse1,parse2)
 return format(diff)
}

// console.log(genDiff('../fixtures/file1.json', '../fixtures/file2.json'))
export default genDiff


