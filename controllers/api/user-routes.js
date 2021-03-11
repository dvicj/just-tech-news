const router = require('express').Router(); 
const { User, Post, Vote } = require('../../models');
const withAuth = require('../utils/auth');

//13.1.6 - GET /api/users
router.get('/', withAuth, (req,res) => {
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
router.get('/:id', withAuth, (req,res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: { // like "SELECT * FROM users WHERE id=1"
            id: req.params.id
        },
        include: [
            {
                model: Post, 
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
            },
            {
                model: Post, 
                attributes: ['title'],
                through: Vote, 
                as: 'voted_posts'
            }
        ]
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
router.post('/', withAuth, (req,res) => {
    //expects { username: '', email: '', password: ''}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.email,
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
      
            res.json(dbUserData);
        });
    })
}); 

//13.2.6 
router.post('/login', withAuth, (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
  
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });
});

router.post('/logout', withAuth, (req,res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
      }
      else {
        res.status(404).end();
      }
});

//13.1.6 - PUT /api/users/1
router.put('/:id', withAuth, (req,res) => {
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
router.delete('/:id', withAuth, (req, res) => {
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