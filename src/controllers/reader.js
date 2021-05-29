
const { Reader } = require('../models');


exports.create = async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const user = req.body.name;
    if (password == null || email == null || user == null) {
        return res.status(400).send({ error: 'Please check for missing text' });
    }
    
    if (password.length < 8 || password > 16) {
        return res.status(401).send({ error: `Password must be between 8 - 16 characters`});
    }
    
    const checkData = await Reader.findAll({
        where: {
            email: req.body.email,
        }
    });
    
    if (checkData[0]) {
        return res.status(409).send({ error: `the email ${email} is already being used` });
    }
    
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
    
};

exports.findAll = async (req, res) => {
    const readers = await Reader.findAll();
    res.status(200).json(readers)
};

exports.findById = async (req, res) => {
    const thisReader = await Reader.findByPk(req.params.id);
    if (!thisReader) {
        return res.status(404).send({ error: 'The reader could not be found.' });
    }
    res.status(200).json(thisReader);
};

exports.update = async (req, res) => {
    let thisReader = await Reader.findByPk(req.params.id);

    if (!thisReader) {
    return res.status(404).send({ error: 'The reader could not be found.' });
    }
    await Reader.update(req.body, {
        where: { 
            id: req.params.id 
        },
    });
    
    thisReader = await Reader.findByPk(req.params.id);
    res.status(200).json(thisReader);
}

exports.delete = async (req, res) => {
    const thisReader = await Reader.findByPk(req.params.id);

    if (!thisReader) {
        return res.status(404).send({ error: 'The reader could not be found.'});
    }

    await Reader.destroy({
        where: { 
            id: req.params.id 
        }
    });
    res.status(204).json(thisReader);
}

