import path from 'path';
import BandwidthModel from "./bandwidth.model.js";
import { defaultLogger } from '../../middlewares/logger.js';

class BandwidthController {
    // Function to update data from Excel
    static async updateData(req, res) {
        const newData = req.body; // Assuming new data is sent in the request body
        console.log("form data: ",newData);
        if(newData.facility){
            let location = newData.facility[0];
            location = location.replace(/\d+$/, '');
            req.query.location = location.toUpperCase(); // Convert location to uppercase
            
            // Calculate the row indices based on the current page number
            const pageSize = 20; // Assuming 20 entries per page
            const currentPage = parseInt(newData.currentPage, 10); // Current page number
            const baseRowIndex = ((currentPage - 1) * pageSize) + 2; // Adjusting for 1-based indexing in Excel

            if (!newData.selectedRows || newData.selectedRows.length < 1) {
                req.flash('error', 'Please select at least one entry to update');
                return BandwidthController.fetchLocationData(req, res);
            }

            try {
                // Update data in Excel
                await BandwidthModel.updateExcel(location.toUpperCase(), newData, baseRowIndex);
                req.flash('success', 'Data updated successfully');
                // Filter partitions based on selectedRows
                const selectedPartitions = newData.selectedRows.map(row => newData.partition[row - 2]);

                // Log the changes
                //changeLogger.info(`${new Date().toLocaleString()}; ${(req.user.name)} updated in ${location.toUpperCase()} and made changes to rows [ ${newData.selectedRows} ], [ ${selectedPartitions} ]`);

                return BandwidthController.fetchLocationData(req, res, currentPage);
            } catch (error) {
                //console.error('Error updating data:', error);
                defaultLogger.error('Error updating data:', error)
                return res.status(500).send('Internal Server Error');
            }
        }
    }

    // Function to fetch data for a specific location
    static async fetchLocationData(req, res, currentPage) {
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
            return res.render('layout', { 
                userName: req.user, 
                locations: locations, 
                locationData: locationData, 
                selectedLocation: location, 
                currentPage: currentPage,
                messages: req.flash() 
            });
            //return res.render('layout', { userName: req.user, locations: locations, locationData: locationData, selectedLocation: location, messages: req.flash() });
        } catch (error) {
            console.error(`Error fetching data for location ${req.query.location}:`, error);
            defaultLogger.error(`Error fetching data for location ${req.query.location}:`, error)
            return res.status(500).send('Internal Server Error');
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
            //changeLogger.info(`${new Date().toLocaleString()}; ${req.user.name} added in ${location.toUpperCase()} for partition ${newData.partition}`);
            return BandwidthController.fetchLocationData(req, res);
        } catch (error) {
            console.error('Error adding data:', error);
            defaultLogger.error('Error adding data:', error)
            return res.status(500).send('Internal Server Error');
        }
    }

    // Function to download the Excel file
    static async downloadExcel(req, res) {
        try {
            const currentDirectory = process.cwd();

            const fileLocation = path.join(currentDirectory, 'bw_billing_tracker_python', 'dist');

            //console.log("pwd:", currentDirectory); /bw_billing_tracker_python/dist/bw_billing_tracker.xlsx

            // Set headers for the response
            res.setHeader('Content-Disposition', 'attachment; filename=bw-billling-tracker.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            res.sendFile('bw_billing_tracker.xlsx', { root: fileLocation });

        } catch (error) {
            console.error('Error downloading Excel:', error);
            defaultLogger.error('Error downloading Excel:', error)
            return res.status(500).send('Internal Server Error');
        }
    }
}

export default BandwidthController;