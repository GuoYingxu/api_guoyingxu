import xlsx from 'node-xlsx'
import * as fs from 'fs'
const workSheet = xlsx.parse(fs.readFileSync('test.xls'))
 
workSheet[0].data.forEach(element => { 
  console.log('A:' +element[3], 'B:'+element[4], 'C:'+element[5],'D:'+element[6])
});