import express from 'express';
import BandwidthController from './bandwidth.controller.js';

const bandwidthRouter = express.Router();

// Define user routes
bandwidthRouter.get('/', BandwidthController.fetchLocationData);
bandwidthRouter.post('/update', BandwidthController.updateData);
bandwidthRouter.post('/add', BandwidthController.addData);
bandwidthRouter.get('/download-excel', BandwidthController.downloadExcel);


export default bandwidthRouter;
