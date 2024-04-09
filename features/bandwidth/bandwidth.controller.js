import BandwidthModel from "./bandwidth.model.js";

class BandwidthController {
    static async loadBandwidthTable(req, res){
        return res.render('layout', {userName: req.user});
    }

    // Function to fetch data from Excel
    static async fetchData(req, res) {
        try {
            // Fetch data from Excel
            const data = await BandwidthModel.readExcel();
            console.log(data)
            return res.json(data);
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
}

export default BandwidthController;