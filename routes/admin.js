const router = require('express').Router();
const { generateLeaseReport, sendEmail, generateReportAndSendEmail } = require('../api/admin-api');

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
router.use(allowCrossDomain);

router.post('/send-email', generateReportAndSendEmail);

module.exports = router;