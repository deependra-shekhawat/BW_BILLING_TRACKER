class BandwidthController {
    static async loadBandwidthTable(req, res){
        return res.render('layout', {userName: req.user});
    }
}

export default BandwidthController;