const recordsModel = require('../../mongo_models/records')

const getIndexedRecords = async (start_date, end_date, min_count, max_count, page_size, skip) => {
    // get all the indexed records
    let response = [];
    
    // create aggregate mongo query
    let query = [
        {
            '$match': {
                'createdAt': {
                    "$gte": start_date , "$lt": end_date
                }
            }
        },
        {
            '$unwind' : "$counts" 
        },
        {
            '$group': {
                '_id': {
                    'key': '$key',
                    'createdAt': '$createdAt'
                },
                'totalCount': {
                    '$sum': '$counts'
                }
            }
        },
        {
            '$match': {
                'totalCount': {
                    "$gte": min_count, 
                    "$lt": max_count
                }
            }
        },
        {
            '$project': {
                '_id': 0,
                'key': '$_id.key',
                'createdAt': '$_id.createdAt',
                'totalCount': '$totalCount'
            }
        },
        {
            '$sort': {
                'key': 1
            }
        },
        {
            '$skip': skip
        },
        {
            '$limit': page_size
        }
    ];

    try {
        let records = await recordsModel.aggregate(query);
        if (records.length) {
            response = records;
        }
        return response;
    } catch(err) {
        console.error(err);
        console.error(err.message);
        throw(err);
    }
}

module.exports = {
    getIndexedRecords
};

