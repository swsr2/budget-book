import * as XLSX from 'xlsx';
import fs from 'fs';

function checkHeaders(filename) {
  try {
    const file = fs.readFileSync(filename);
    const workbook = XLSX.read(file, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`--- Header for ${filename} ---`);
    console.log(jsonData[0]); 
  } catch (e) {
    console.log(`Could not read ${filename}: ${e.message}`);
  }
}

checkHeaders('가계부_1-2.xlsx');
checkHeaders('가계부_샘플.xlsx');
