import db from "../db/db.js";

const getCompanyTypes = (callback) => {
    const sql = `SELECT * FROM CompanyTypes`;
    db.all(sql, [], (err, types) => {
        if (err) {
            return callback(err);
        }
        callback(null, types);
    });
};

export const getPartners = (req, res) => {
    const sql = `
        SELECT p.id, p.company_name, p.tax_number, p.rating, p.legal_address, p.director_name, p.phone, p.email, p.logo, ct.type_name AS partner_type
        FROM Partners p
        LEFT JOIN CompanyTypes ct ON p.company_type_id = ct.id
    `;

    db.all(sql, [], (err, partners) => {
        if (err) {
            return res.status(500).render('error', { message: 'Ошибка при получении списка партнёров', error: err });
        }

        // Преобразуем каждый логотип из BLOB в base64
        const partnersWithLogo = partners.map(partner => {
            if (partner.logo) {
                partner.logo = `data:image/png;base64,${partner.logo.toString('base64')}`;
            }
            return partner;
        });

        res.render('partners', { partners: partnersWithLogo });
    });
};

export const getPartner = (req, res) => {
    const partnerId = req.params.id;
    const sql = `SELECT * FROM Partners WHERE id = ?`;

    db.get(sql, [partnerId], (err, partner) => {
        if (err || !partner) {
            return res.status(404).render('error', { message: 'Партнёр не найден', error: err });
        }

        getCompanyTypes((err, companyTypes) => {
            if (err) {
                return res.status(500).render('error', { message: 'Ошибка при получении типов компаний', error: err });
            }
            res.render('partnerForm', { partner, companyTypes });
        });
    });
};

export const savePartner = (req, res) => {
    const { id, company_name, company_type_id, rating, legal_address, tax_number, director_name, phone, email } = req.body; // Добавили tax_number
    let logo = null;

    if (req.file) {
        logo = req.file.buffer; 
    }

    if (!company_name || !company_type_id || rating < 0 || !legal_address || !tax_number) {
        return getCompanyTypes((err, companyTypes) => {
            if (err) {
                return res.status(500).render('error', { message: 'Ошибка при получении типов компаний', error: err });
            }
            return res.render('partnerForm', {
                errorMessage: 'Пожалуйста, заполните все поля корректно',
                partner: { id, company_name, company_type_id, rating, legal_address, tax_number, director_name, phone, email }, // Добавили tax_number
                companyTypes
            });
        });
    }

    const data = [company_name, company_type_id, rating, legal_address, tax_number, director_name, phone, email, logo];

    if (id) {
        const updateSql = `UPDATE Partners SET company_name = ?, company_type_id = ?, rating = ?, legal_address = ?, tax_number = ?, director_name = ?, phone = ?, email = ?, logo = ? WHERE id = ?`;
        db.run(updateSql, [...data, id], (err) => {
            if (err) {
                return res.status(500).render('error', { message: 'Ошибка при обновлении данных партнёра', error: err });
            }
            res.redirect('/partners');
        });
    } else {
        const insertSql = `INSERT INTO Partners (company_name, company_type_id, rating, legal_address, tax_number, director_name, phone, email, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(insertSql, data, (err) => {
            if (err) {
                return res.status(500).render('error', { message: 'Ошибка при добавлении партнёра', error: err });
            }
            res.redirect('/partners');
        });
    }
};


export const getNewPartnerForm = (req, res) => {
    getCompanyTypes((err, companyTypes) => {
        if (err) {
            return res.status(500).render('error', { message: 'Ошибка при получении типов компаний', error: err });
        }
        res.render('partnerForm', { partner: null, companyTypes });
    });
};

export const deletePartner = (req, res) => {
    const partnerId = req.params.id;

    const sql = `DELETE FROM Partners WHERE id = ?`;

    db.run(sql, [partnerId], function (err) {
        if (err) {
            return res.status(500).render('error', { message: 'Ошибка при удалении партнёра', error: err });
        }
        res.redirect('/partners');
    });
};