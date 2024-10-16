import db from './db.js';

export const calculateAndUpdateDiscount = (partner_id, callback) => {
    let sql = `SELECT SUM(quantity) AS quantity FROM SalesHistory WHERE partner_id = ?`;

    db.get(sql, [partner_id], (err, row) => {
        if (err) {
            return callback(err);
        }
        
        const quantity = row.quantity || 0;
        let discount = 0;

        if (quantity >= 10000 && quantity < 50000) {
            discount = 5;
        } else if (quantity >= 50000 && quantity < 300000) {
            discount = 10;
        } else if (quantity >= 300000) {
            discount = 15;
        }

        const updateSql = `
            INSERT INTO Discounts (partner_id, discount_percentage)
            VALUES (?, ?)
            ON CONFLICT(partner_id) 
            DO UPDATE SET discount_percentage = excluded.discount_percentage;
        `;

        db.run(updateSql, [partner_id, discount], (updateErr) => {
            if (updateErr) {
                return callback(updateErr);
            }
            callback(null, discount);
        });
    });
}