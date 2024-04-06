import express from 'express';
import BandwidthController from './bandwidth.controller.js';

const bandwidthRouter = express.Router();

// Define user routes
bandwidthRouter.get('/', BandwidthController.loadBandwidthTable);


export default bandwidthRouter;
