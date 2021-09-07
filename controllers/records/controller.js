const _ = require('lodash');
const constantHelper = require("../../helpers/constants");
const recordsHelper = require("../records/helper");
const moment = require('moment');

exports.getRecords = async (req, res, next) => {
    let response = {
        'code': 0,
        'msg': constantHelper.httpStatusMessage.SUCCESS_200,
        'records': []
    }
    
    // fetch query params page and size
    const params = req.swagger.params;
    const page_no = params.page.value;
    const page_size = params.size.value;
    let skip = page_size * (page_no - 1);
    
    // fetch body
    const data = params.body.value;
    let start_date = new Date(data.startDate);
    let end_date = new Date(data.endDate);
    let min_count = data.minCount;
    let max_count = data.maxCount;
    
    // indexed records
    await recordsHelper.getIndexedRecords(start_date, end_date, min_count, max_count, page_size, skip)
    .then(result => {
        response.records = result;
        return res.status(200).json(response);
    })
    .catch(error => {
        response.code = 1;
        response.msg = constantHelper.httpStatusMessage.ERROR_503;
        return res.status(503).json(response);
    });
};