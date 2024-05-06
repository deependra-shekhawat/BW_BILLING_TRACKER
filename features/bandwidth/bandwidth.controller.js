import path from 'path';
import BandwidthModel from "./bandwidth.model.js";
import excelConfig from '../../config/excel.config.js'; // Import excelConfig

class BandwidthController {
    // Function to update data from Excel
    static async updateData(req, res) {
        const newData = req.body; // Assuming new data is sent in the request body
        if(newData.facility){
            let location = newData.facility[0];
            location = location.replace(/\d+$/, '');
            req.query.location = location.toUpperCase(); // Convert location to uppercase
            if (!newData.selectedRows || newData.selectedRows.length < 1) {
                req.flash('error', 'Please select at least one entry to update');
                return BandwidthController.fetchLocationData(req, res);
            }
            try {
                // Update data in Excel
                await BandwidthModel.updateExcel(location.toUpperCase(), newData);
                req.flash('success', 'Data updated successfully');
                return BandwidthController.fetchLocationData(req, res);
            } catch (error) {
                console.error('Error updating data:', error);
                return res.status(500).send('Internal Server Error');
            }
        }
    }

    // Function to fetch data for a specific location
    static async fetchLocationData(req, res) {
        try {
            // Fetch locations from the BandwidthModel
            const excelData = await BandwidthModel.readExcel();
            let locations = Object.keys(excelData);
            // Convert locations to uppercase
            locations = locations.map(location => location.toUpperCase());

            // Fetch data for the specified location from the BandwidthModel
            let location = req.query.location;
            // Convert location to uppercase
            if(location){
                location = location.toUpperCase();
            }
            const locationData = excelData[location];
            return res.render('layout', { userName: req.user, locations: locations, locationData: locationData, selectedLocation: location, messages: req.flash() });
        } catch (error) {
            console.error(`Error fetching data for location ${req.query.location}:`, error);
            throw error;
        }
    }

    // Function to add data to Excel
    static async addData(req, res) {
        try {
            const newData = req.body; // Assuming new data is sent in the request body
            //console.log(req.body);
            const location = newData.location.toUpperCase(); // Convert location to uppercase
            await BandwidthModel.addDataInExcel(location, newData);
            req.flash('success', 'Data added successfully');
            req.query.location = location;
            return BandwidthController.fetchLocationData(req, res);
        } catch (error) {
            console.error('Error adding data:', error);
            req.flash('error', 'Failed to add data');
            return res.status(500).send('Internal Server Error');
        }
    }

    // Function to download the Excel file
    static async downloadExcel(req, res) {
        try {
            // Get the file path of the Excel file to download
            //const filePath = new URL(excelConfig.filePath, import.meta.url).pathname;
            // const __filename = new URL(import.meta.url).pathname;
            // const __dirname = path.dirname(__filename)
            // const filePath = path.join(__dirname + '..', '..', 'python_script','bw_billing_tracker.xlsx');
            const currentDirectory = process.cwd();

            const fileLocation = path.join(currentDirectory, 'python_script');

            //console.log("pwd:", currentDirectory);

            // Set headers for the response
            res.setHeader('Content-Disposition', 'attachment; filename=bw-billling-tracker.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            res.sendFile('bw_billing_tracker.xlsx', { root: fileLocation });

        } catch (error) {
            console.error('Error downloading Excel:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default BandwidthController;
