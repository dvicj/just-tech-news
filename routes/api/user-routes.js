const router = require('express').Router(); 
const { User } = require('../../models');

//13.1.6 - GET /api/users
router.get('/', (req,res) => {
    //access our User model and run .findAll() method
    User.findAll( {
        attributes: { exclude: ['password']}
    }) //like "SELECT * FROM"
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//13.1.6 - GET /api/users/1
router.get('/:id', (req,res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: { // like "SELECT * FROM users WHERE id=1"
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with this id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

//13.1.6 - POST /api/users
router.post('/', (req,res) => {
    //expects { username: '', email: '', password: ''}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.email,
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//13.1.6 - PUT /api/users/1
router.put('/', (req,res) => {
    //if req.body has exact key/value pairs to match the model, you can just use req.body
    User.update(req.body, {
        individualHooks: true, 
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id.'});
            return; 
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//13.1.6 - DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return; 
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router; 