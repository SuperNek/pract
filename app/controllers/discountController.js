import db from '../db/db.js';
import { calculateAndUpdateDiscount } from '../db/updateDiscounts.js';

export const updateAllDiscounts = (req, res) => {
    const sql = `SELECT id FROM Partners`;

    db.all(sql, [], (err, partners) => {
        if (err) {
            return res.status(500).send("Discount controller error: Can't get partners");
        }

        const discountPromises = partners.map((partner) => {
            return new Promise((resolve, reject) => {
                calculateAndUpdateDiscount(partner.id, (err) => {
                    if (err) {
                        console.error(`Discount controller error: Can't update partner with ${partner.id} ID:`, err);
                        reject(`Discount controller error: Can't update partner with ${partner.id} ID`);
                    } else {
                        resolve();
                    }
                });
            });
        });

        Promise.all(discountPromises)
            .then(() => {
                res.send('Discounts are updated');
            })
            .catch((error) => {
                console.error("Discount controller error: Can't update discounts", error);
                res.status(500).send(error);
            });
    });
};
