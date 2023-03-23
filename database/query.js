const connection = require('./connection')

const query = (sql, datas = null) => {
    try{
        return new Promise(async (resolve, reject) => {
            await connection.query(sql, datas, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows);
                }
                //connection.end();
            })
        })
    }catch (e) {
        console.log(e)
        return null;
    }
}

module.exports = query;
