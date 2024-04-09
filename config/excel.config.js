import xlsx from 'xlsx';

const excelConfig = {
    filePath: './python_script/bw_billing_tracker.xlsx', // Path to the Excel file
    sheetNames: [], // Array to store sheet names
    data: {}, // Object to store data from each sheet
};

// Function to read data from Excel file
const readExcel = () => {
    const workbook = xlsx.readFile(excelConfig.filePath);
    excelConfig.sheetNames = workbook.SheetNames;

    excelConfig.sheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        excelConfig.data[sheetName] = xlsx.utils.sheet_to_json(sheet);
    });
};

// Call the readExcel function to read data from Excel file
readExcel();

//console.log(excelConfig.data);

export default excelConfig;