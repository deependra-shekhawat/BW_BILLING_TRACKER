import BandwidthModel from "./bandwidth.model.js";

class BandwidthController {
    // Function to update data from Excel
    static async updateData(req, res) {
        const newData = req.body; // Assuming new data is sent in the request body
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
}

export default BandwidthController;
