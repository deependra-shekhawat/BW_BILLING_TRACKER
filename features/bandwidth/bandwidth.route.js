import express from 'express';
import BandwidthController from './bandwidth.controller.js';

const bandwidthRouter = express.Router();

// Define user routes
//bandwidthRouter.get('/', BandwidthController.loadBandwidthTable);
bandwidthRouter.get('/', BandwidthController.fetchLocationData);
bandwidthRouter.post('/update', BandwidthController.updateData);


export default bandwidthRouter;
