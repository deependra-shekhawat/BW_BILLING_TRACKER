import BandwidthModel from "./bandwidth.model.js";

class BandwidthController {
    // Function to fetch data from Excel
    static async fetchData(req, res) {
        try {
            // Fetch data from Excel
            const data = await BandwidthModel.readExcel();
            return res.render('layout',{userName: req.user, locations: null, locationData: null});
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    // Function to update data from Excel
    static async updateData(req, res) {
        const newData = req.body; // Assuming new data is sent in the request body
        try {
            // Update data in Excel
            await BandwidthModel.updateExcel(newData);
            return res.send('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    // Function to fetch locations
    static async fetchLocations(req, res) {
        try {
            // Fetch locations from the BandwidthModel
            const data = await BandwidthModel.readExcel();
            data = Object.keys(data);
            return res.render('layout',{userName: req.user, locations: data, locationData: null});
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    // Function to fetch data for a specific location
    static async fetchLocationData(req, res) {
        try {
            // Fetch locations from the BandwidthModel
            const excelData = await BandwidthModel.readExcel();
            const locations = Object.keys(excelData);
            console.log(locations);

            // Fetch data for the specified location from the BandwidthModel
            const location = req.query.location;
            console.log(req.body);
            const locationData = excelData[location];
            return res.render('layout',{userName: req.user, locations: locations, locationData: locationData});
        } catch (error) {
            console.error(`Error fetching data for location ${location}:`, error);
            throw error;
        }
    }
}

export default BandwidthController;