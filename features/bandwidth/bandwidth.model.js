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

    static async updateExcel(location, newData, baseRowIndex) {
        try {
            const workbook = xlsx.readFile(excelConfig.filePath);

            if (!workbook.Sheets.hasOwnProperty(location)) {
                throw new Error(`Sheet with name ${location} not found in Excel file.`);
            }

            //console.log(newData);

            const sheet = workbook.Sheets[location];
            const range = xlsx.utils.decode_range(sheet['!ref']);

            // Loop through the selected rows in the newData object
            for (const rowIndex of newData.selectedRows) {
                console.log("base row index",baseRowIndex);
                console.log("row index",rowIndex);
                console.log("changing index",newData.projectName[rowIndex - baseRowIndex]);
                // Update data in the Excel sheet based on the row index and column names
                // Adjust column index according to your Excel sheet structure
                sheet['A' + rowIndex] = { v: newData.month[rowIndex - baseRowIndex], t: 's' };
                sheet['B' + rowIndex] = { v: newData.projectName[rowIndex - baseRowIndex], t: 's' };
                sheet['C' + rowIndex] = { v: newData.status[rowIndex - baseRowIndex], t: 's' };
                sheet['D' + rowIndex] = {
                    v: newData.facility[rowIndex - baseRowIndex] ? (newData.facility[rowIndex - baseRowIndex]).toUpperCase() : '',
                    t: 's'
                };
                sheet['E' + rowIndex] = { v: newData.tower[rowIndex - baseRowIndex], t: 's' };
                sheet['F' + rowIndex] = { v: newData.bu[rowIndex - baseRowIndex], t: 's' };
                sheet['G' + rowIndex] = { v: newData.subnet[rowIndex - baseRowIndex], t: 's' };
                sheet['H' + rowIndex] = { v: newData.pat[rowIndex - baseRowIndex], t: 's' };
                sheet['I' + rowIndex] = { v: newData.pidb[rowIndex - baseRowIndex], t: 's' };
                sheet['J' + rowIndex] = { v: newData.gdcn[rowIndex - baseRowIndex], t: 's' };
                sheet['K' + rowIndex] = { v: newData.partition[rowIndex - baseRowIndex], t: 's' };
                sheet['L' + rowIndex] = { v: newData.isp[rowIndex - baseRowIndex], t: 's' };
                sheet['M' + rowIndex] = { v: newData.bw[rowIndex - baseRowIndex], t: 's' };
                sheet['N' + rowIndex] = { v: newData.wbse[rowIndex - baseRowIndex], t: 's' };
                sheet['O' + rowIndex] = { v: newData.rfc[rowIndex - baseRowIndex], t: 's' };
                sheet['P' + rowIndex] = { v: newData.implementationDate[rowIndex - baseRowIndex], t: 's' };
                sheet['Q' + rowIndex] = { v: newData.amt[rowIndex - baseRowIndex], t: 's' };
                sheet['R' + rowIndex] = { v: newData.bcp[rowIndex - baseRowIndex], t: 's' };
                sheet['S' + rowIndex] = { v: newData.comment[rowIndex - baseRowIndex], t: 's' };
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
            // Load existing workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(excelConfig.filePath);

            // Get the worksheet based on location
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