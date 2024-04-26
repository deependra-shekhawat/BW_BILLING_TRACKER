import xlsx from 'xlsx'; // Import xlsx library
import ExcelJS from 'exceljs';
import excelConfig from '../../config/excel.config.js'; // Import excelConfig

class BandwidthModel {
    static async readExcel() {
        try {
            const workbook = xlsx.readFile(excelConfig.filePath);
            const data = {};

            excelConfig.sheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                data[sheetName] = xlsx.utils.sheet_to_json(sheet);
            });

            return data;
        } catch (error) {
            console.error('Error reading Excel:', error);
            throw error;
        }
    }

    static async updateExcel(location, newData) {
        try {
            const workbook = xlsx.readFile(excelConfig.filePath);
    
            if (!workbook.Sheets.hasOwnProperty(location)) {
                throw new Error(`Sheet with name ${location} not found in Excel file.`);
            }
    
            const sheet = workbook.Sheets[location];
            const range = xlsx.utils.decode_range(sheet['!ref']);
    
            // Loop through the selected rows in the newData object
            for (const rowIndex of newData.selectedRows) {
                // Update data in the Excel sheet based on the row index and column names
                // Adjust column index according to your Excel sheet structure
                sheet['A' + rowIndex] = { v: newData.month[rowIndex - 2], t: 's' };
                sheet['B' + rowIndex] = { v: newData.projectName[rowIndex - 2], t: 's' };
                sheet['C' + rowIndex] = { v: newData.status[rowIndex - 2], t: 's' };
                sheet['D' + rowIndex] = { v: (newData.facility[rowIndex - 2]).toUpperCase(), t: 's' };
                sheet['E' + rowIndex] = { v: newData.tower[rowIndex - 2], t: 's' };
                sheet['F' + rowIndex] = { v: newData.bu[rowIndex - 2], t: 's' };
                sheet['G' + rowIndex] = { v: newData.subnet[rowIndex - 2], t: 's' };
                sheet['H' + rowIndex] = { v: newData.pat[rowIndex - 2], t: 's' };
                sheet['I' + rowIndex] = { v: newData.pidb[rowIndex - 2], t: 's' };
                sheet['J' + rowIndex] = { v: newData.gdcn[rowIndex - 2], t: 's' };
                sheet['K' + rowIndex] = { v: newData.partition[rowIndex - 2], t: 's' };
                sheet['L' + rowIndex] = { v: newData.isp[rowIndex - 2], t: 's' };
                sheet['M' + rowIndex] = { v: newData.bw[rowIndex - 2], t: 's' };
                sheet['N' + rowIndex] = { v: newData.wbse[rowIndex - 2], t: 's' };
                sheet['O' + rowIndex] = { v: newData.rfc[rowIndex - 2], t: 's' };
                sheet['P' + rowIndex] = { v: newData.implementationDate[rowIndex - 2], t: 's' };
                sheet['Q' + rowIndex] = { v: newData.amt[rowIndex - 2], t: 's' };
                sheet['R' + rowIndex] = { v: newData.bcp[rowIndex - 2], t: 's' };
                sheet['S' + rowIndex] = { v: newData.comment[rowIndex - 2], t: 's' };
            }

            // Save the workbook with updated data
            await xlsx.writeFile(workbook, excelConfig.filePath);
    
            return true; // Indicates successful update
        } catch (error) {
            console.error('Error updating Excel:', error);
            throw error;
        }
    }  

    static async addDataInExcel(location, newData) {
        try {
            // Load existing workbook or create a new one
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(excelConfig.filePath);

            // Get the worksheet based on location or create a new one if not found
            let worksheet = workbook.getWorksheet(location);

            // Add new row with data
            const newRow = worksheet.addRow([
                newData.month,
                newData.projectName,
                newData.status,
                newData.facility.toUpperCase(),
                newData.tower,
                newData.bu,
                newData.subnet,
                newData.pat,
                newData.pidb,
                newData.gdcn,
                newData.partition,
                newData.isp,
                newData.bw,
                newData.wbse,
                newData.rfc,
                newData.implementationDate,
                newData.amt,
                newData.bcp,
                newData.comments
            ]);

            // Save the workbook
            await workbook.xlsx.writeFile(excelConfig.filePath);

            return true; // Indicates successful addition
        } catch (error) {
            console.error('Error adding data to Excel:', error);
            throw error;
        }  
    }
}

export default BandwidthModel;
