import xlsx from 'xlsx'; // Import xlsx library
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

    static async updateExcel(newData) {
        try {
            // Implement logic to update Excel with new data
            // Example: xlsx.writeFile(updatedWorkbook, excelConfig.filePath);
            // Make sure to properly format and save the updated Excel file
        } catch (error) {
            console.error('Error updating Excel:', error);
            throw error;
        }
    }

    static async fetchLocations() {
        try {
            const excelData = await this.readExcel();
            const locations = Object.keys(excelData);
            return locations;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    static async fetchLocationData(location) {
        try {
            const excelData = await this.readExcel();
            const locationData = excelData[location];
            return locationData;
        } catch (error) {
            console.error(`Error fetching data for location ${location}:`, error);
            throw error;
        }
    }
}

export default BandwidthModel;
