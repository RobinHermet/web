
var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth')
const CryptoJS = require('crypto-js');




//////////////////////// TOURNAMENT ////////////////////////

//////////////////////// GET /////////////////////////
// Permet d'afficher les informations d'une compétition (fonctionnel)


router.get('/tournament/:id', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM competition INNER JOIN sports on competition.typeSport = sports.idSport WHERE idCompet=?` ;
  
  // first row only
  db.get(sql,[req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(row);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

/////////////////////// GET TOURNAMENT BY OWNER/////////////////////////
// Permet d'afficher les informations d'une compétition (fonctionnel)


router.get('/tournament/all/:idOwner', function (req, res) {
  // open the database
  try{
    let idOwner = parseInt(req.params.idOwner,10)
    if (typeof idOwner === "number" && idOwner > 0){ 

      let db = new sqlite3.Database('./dataBase.db'); 
      let sql = `SELECT * FROM competition INNER JOIN sports on competition.typeSport = sports.idSport WHERE ownerIdSportif=?` ;
      
      db.all(sql, [idOwner], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }
        res.json(rows);
      
      });
      
      // close the database connection
      db.close();
    }
    else{
      res.send('Error');
    }
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})


//////////////////////// GET ALL /////////////////////////
// Permet d'afficher toutes les compétitions disponibles (fonctionnel)


router.get('/tournament', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM competition INNER JOIN sports ON competition.typeSport = sports.idSport`;
  
  // first row only
  db.all(sql, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// GET TOURNAMENT BY SPORT /////////////////////////
// Permet d'afficher toutes les compétitions disponibles (fonctionnel)


router.get('/sport/:id/tournament', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM competition INNER JOIN sports ON competition.typeSport = sports.idSport AND sports.idSport=?` ;
  
  db.all(sql,[req.params.id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// POST /////////////////////////
// Permet d'ajouter une compétition, lets gooooooo ça marche 

router.post('/tournament', auth, function (req, res) {
  try{
  const typeSport = req.body.typeSport;
  const ownerIdSportif = req.body.ownerIdSportif;
  const begin_date = req.body.begin_date.trim();
  const city = req.body.city.trim();
  const minAge = req.body.minAge;
  const maxAge = req.body.maxAge;
  const registrationPrice = req.body.registrationPrice;
  const beginHour = req.body.beginHour.trim();

  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('INSERT INTO competition(typeSport,ownerIdSportif,begin_date,city,minAge,maxAge,registrationPrice,beginHour) VALUES(?,?,?,?,?,?,?,?)', [typeSport,ownerIdSportif,begin_date,city,minAge,maxAge,registrationPrice,beginHour], function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'typeSport' : typeSport,
      'ownerIdSportif' : ownerIdSportif,
      'begin_date' : begin_date,
      'city': city,
      'minAge': minAge,
      'maxAge': maxAge,
      'registrationPrice': registrationPrice,
      'beginHour': beginHour
    });
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// COMPLEX DELETE /////////////////////////
// Permet de supprimer une compétition (fonctionnel)
// idSportif correspond à l'id du sportif voulant supprimer la compétition d'id idCompet
//on vérifie d'abord que l'id de la personne ayant créé la compétition (qui correspond à ownerIdSportif) soit bien celui 
// qui fait la requête pour la supprimer (qui correspond à req.auth.athleteId)
router.delete('/tournament/:idSportif/:idCompet', auth, function (req, res) {
  // open the database
  const ownerIdSportif = req.params.idSportif;
  console.log(ownerIdSportif);
  console.log(req.auth.athleteId);
  if (ownerIdSportif == req.auth.athleteId){
    try{
      let db = new sqlite3.Database('./dataBase.db');  
    
    db.run('DELETE FROM competition WHERE rowid=?', req.params.idCompet, function(err){
      if (err){
        return console.log(err.message);
      }
      res.send('Tournament deleted')
    })
    
    // close the database connection
    db.close();
    }
    catch(err){
      console.error('handle the err: ', err)
    }
      
  }
  else{
    console.log('You are not the owner of this announcement')
  }
  
})

//////////////////////// DELETE ADMIN /////////////////////////
// Permet de supprimer une compétition (fonctionnel)
// idSportif correspond à l'id du sportif voulant supprimer la compétition d'id idCompet
//on vérifie d'abord que l'id de la personne ayant créé la compétition (qui correspond à ownerIdSportif) soit bien celui 
// qui fait la requête pour la supprimer (qui correspond à req.auth.athleteId)
router.delete('/admin/tournament/:isAdmin/:idCompet', auth, function (req, res) {
  // open the database
  const isAdmin = req.params.isAdmin
  console.log(req.params.isAdmin);
  if (isAdmin == req.auth.isAdmin){
    try{
      let db = new sqlite3.Database('./dataBase.db');  
    
    db.run('DELETE FROM competition WHERE rowid=?', req.params.idCompet, function(err){
      if (err){
        return console.log(err.message);
      }
      res.send('Tournament deleted')
    })
    
    // close the database connection
    db.close();
    }
    catch(err){
      console.error('handle the err: ', err)
    }
      
  }
  else{
    console.log('It seems that a problem just occur')
  }
  
})


//////////////////////// PUT /////////////////////////
// Permet de modifier les informations sur une compétition, lets gooooooo ça marche 

router.put('/tournament/:id', auth, function (req, res) {
  try{
  const typeSport = req.body.typeSport.trim();
  const begin_date = req.body.begin_date.trim();
  const city = req.body.city.trim();
  const minAge = req.body.minAge;
  const maxAge = req.body.maxAge;
  const registrationPrice = req.body.registrationPrice;
  const beginHour = req.body.beginHour.trim();
  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = 'UPDATE competition SET typeSport = ?, begin_date = ?, city = ? , minAge = ?, maxAge =?, registrationPrice = ?, beginHour = ? WHERE idCompet =?' ;
  
  db.run( sql,[typeSport,begin_date,city,minAge,maxAge,registrationPrice,beginHour,req.params.id], function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'typeSport' : typeSport,
      'begin_date' : begin_date,
      'city': city,
      'minAge': minAge,
      'maxAge': maxAge,
      'registrationPrice': registrationPrice,
      'beginHour': beginHour
    });
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})


//////////////////////// ATHLETE ////////////////////////

//////////////////////// GET /////////////////////////
// Permet d'afficher les informations d'un athlète (fonctionnel)

router.get('/athlete/:id', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT name,surname,age, city, password, email FROM sportif WHERE idSportif=?`;
  
  // first row only
  db.get(sql,[req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(row);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// GET ALL /////////////////////////
// Permet d'afficher tous les athlètes (fonctionnel)

router.get('/athlete', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT idSportif,name,surname,age, city,email FROM sportif`;
  
  // first row only
  db.all(sql, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// POST - SIGNUP /////////////////////////
// Permet à un sportif de s'inscrire, lets gooooooo ça marche 

router.post('/athlete/signup', function (req, res) {
  try{const name = req.body.name;
    const surname = req.body.surname;
    const age = req.body.age;
    const city = req.body.city;
    const email = req.body.email;
    const isAdmin = req.body.isAdmin
  
    // open the database
    let db = new sqlite3.Database('./dataBase.db');

    //let decrypt password before hash it
    const password = CryptoJS.AES.decrypt(req.body.password, process.env.CRYPTO).toString(CryptoJS.enc.Utf8)
  
    //hash the password, then insert in the database
    bcrypt.hash(password, 10).then(hash => {
      db.run('INSERT INTO sportif(name,surname,age,city,password,email,isAdmin) VALUES(?,?,?,?,?,?,?)', [name,surname,age,city,hash,email,isAdmin],  function(err){
        if (err){
          return console.log(err.message);
        }
        res.json({
          'name' : name,
          'surname' : surname,
          'age': age,
          'city': city,
          'password': hash
        });
      })
      db.close();
    }); 
  }
  catch(err){
    console.error('handle the err: ', err)
  }
   

})


//////////////////////// POST - LOGIN /////////////////////////
// Permet à un sportif de se login, lets gooooooo ça marche 

router.post('/athlete/login', function (req, res) {
  try{
    const email = req.body.email;
    //let decrypt password before hash it
    const password = CryptoJS.AES.decrypt(req.body.password, process.env.CRYPTO).toString(CryptoJS.enc.Utf8)

  // open the database
  let db = new sqlite3.Database('./dataBase.db');
  console.log(process.env.TOKEN)
  db.get('SELECT * FROM sportif WHERE email=?',email,function(err,row){
    if (err){
      return console.log(err.message);
    }
    console.log(row)
    if (row != undefined){
      let hash = row.password;
      bcrypt.compare(password, hash.trim() )
          .then(isValid => {
            console.log(isValid);
            if (!isValid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              athleteId : row.idSportif,
              isAdmin: row.isAdmin,
              token: jwt.sign(
                { athleteId : row.idSportif, isAdmin : row.isAdmin },
                process.env.TOKEN,
                { expiresIn: '24h' }
              )
            });
          })
    }
    else{
      return res.status(401).json({error: 'Wrong email adress'})
    }
  
  })
  db.close();
  
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// DELETE /////////////////////////
// Permet de supprimer un athlete (fonctionnel)

router.delete('/admin/athlete/:id', auth, function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('DELETE FROM sportif WHERE rowid=?', req.params.id, function(err){
    if (err){
      return console.log(err.message);
    }
    res.send('Athlete deleted')
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// PUT /////////////////////////
// Permet de modifier les informations sur un athlete, lets gooooooo ça marche 

router.put('/athlete/:id', auth, function (req, res) {
  try{
  const name = req.body.name.trim();
  const surname = req.body.surname.trim();
  const age = req.body.age.trim();
  const city = req.body.city.trim();
  const email = req.body.email.trim();

  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  //hash the new password, then update data in the db
  bcrypt.hash(req.body.password, 10).then(hash => {
    let sql = 'UPDATE sportif SET name = ?, surname = ?, age = ?, city = ?,password = ? , email = ? WHERE idSportif =?' ;
  
  db.run( sql, [name,surname,age,city,hash,email],function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'name' : name,
      'surname' : surname,
      'age': age,
      'city': city,
      'password': hash
    });
  })
  
  // close the database connection
  db.close();
  });  
  }
  catch(err){
    console.error('handle the err: ', err)
  }

})


//////////////////////// INSCRIPTION ////////////////////////


//////////////////////// GET ALL /////////////////////////
// Permet d'afficher toutes les inscriptions d'un inscrit(ça marche)

router.get('/registration/:id', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM ((sportif INNER JOIN inscription ON sportif.idSportif = inscription.sportif) INNER JOIN competition on inscription.compet = competition.idCompet) INNER JOIN sports on competition.typeSport = sports.idSport WHERE inscription.sportif=?` ;
  
  db.all(sql,[req.params.id], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// GET NB INSCRITS /////////////////////////
// Permet d'afficher le nombre d'inscrits à une compétition

router.get('/registration/inscrit/:idCompet', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT COUNT(*) FROM ((sportif INNER JOIN inscription ON sportif.idSportif = inscription.sportif) INNER JOIN competition on inscription.compet = competition.idCompet) INNER JOIN sports on competition.typeSport = sports.idSport WHERE inscription.compet=?` ;
  
  db.all(sql,[req.params.idCompet], (err, nb) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(nb);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// POST /////////////////////////
// Permet d'ajouter une inscription à une compétition, lets gooooooo ça marche 

router.post('/registration', function (req, res) {
  try{
  const sportif = req.body.sportif;
  const compet = req.body.compet;
  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('INSERT INTO inscription(sportif,compet) VALUES(?,?)', [sportif,compet] ,function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'sportif' : sportif,
      'compet' : compet,
    });
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// DELETE /////////////////////////
// Permet de se désinscrire (fonctionnel)

router.delete('/registration/:id', auth, function (req, res) {
  // open the database
  
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('DELETE FROM inscription WHERE rowid=?', req.params.id, function(err){
    if (err){
      return console.log(err.message);
    }
    res.send('Registration canceled')
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// NEWS ////////////////////////

//////////////////////// GET /////////////////////////
// Permet d'afficher les informations d'une news (fonctionnel)


router.get('/news/:id', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM news WHERE idNews=?` ;
  
  // first row only
  db.get(sql,[req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(row);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})


//////////////////////// GET ALL /////////////////////////
// Permet d'afficher toutes les news disponibles (fonctionnel)


router.get('/news', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM news`;
  
  // first row only
  db.all(sql, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})


//////////////////////// GET NEWS BY OWNER /////////////////////////
// Permet d'afficher toutes les news disponibles (fonctionnel)


router.get('/news/all/:idOwner', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM news WHERE ownerId=?`;
  
  // first row only
  db.all(sql,[req.params.idOwner], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// POST /////////////////////////
// Permet d'ajouter une news, lets gooooooo ça marche 

router.post('/news', auth, function (req, res) {
  try{
  const ownerId = req.body.ownerId;
  const title = req.body.title.trim();
  const subtitle = req.body.subtitle.trim();
  const contents = req.body.contents.trim();
  const publishingDate = req.body.publishingDate.trim();

  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('INSERT INTO news(ownerId,title,subtitle,contents,publishingDate) VALUES(?,?,?,?,?)',[ownerId,title,subtitle,contents,publishingDate],  function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'ownerId': ownerId,
      'title' : title,
      'subtitle' : subtitle,
      'contents': contents,
      'publishingDate': publishingDate
    });
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// DELETE /////////////////////////
// Permet de supprimer une news (fonctionnel)
// idSportif correspond à l'id du sportif voulant supprimer la compétition d'id idCompet
//on vérifie d'abord que l'id de la personne ayant créé la compétition (qui correspond à ownerIdSportif) soit bien celui 
// qui fait la requête pour la supprimer (qui correspond à req.auth.athleteId)

router.delete('/news/:idSportif/:idNews', auth, function (req, res) {
  console.log(req.params.idSportif)
  const ownerIdSportif = req.params.idSportif;
  if (ownerIdSportif == req.auth.athleteId){
    try{
      // open the database
      let db = new sqlite3.Database('./dataBase.db');  
      
      db.run('DELETE FROM news WHERE rowid=?', req.params.idNews, function(err){
        if (err){
          return console.log(err.message);
        }
        res.send('News deleted')
      })
      
      // close the database connection
      db.close();
      }
      catch(err){
        console.error('handle the err: ', err)
      }
  }
  else{
    console.log('You are not the owner of this announcement')
  }

})

//////////////////////// DELETE ADMIN /////////////////////////
// Permet de supprimer une news (fonctionnel)
// idSportif correspond à l'id du sportif voulant supprimer la compétition d'id idCompet
//on vérifie d'abord que l'id de la personne ayant créé la compétition (qui correspond à ownerIdSportif) soit bien celui 
// qui fait la requête pour la supprimer (qui correspond à req.auth.athleteId)
router.delete('/admin/news/:isAdmin/:idNews', auth, function (req, res) {
  // open the database
  const isAdmin = req.params.isAdmin
  console.log(req.params.isAdmin);
  if (isAdmin == req.auth.isAdmin){
    try{
      let db = new sqlite3.Database('./dataBase.db');  
    
    db.run('DELETE FROM news WHERE rowid=?', req.params.idNews, function(err){
      if (err){
        return console.log(err.message);
      }
      res.send('News deleted')
    })
    
    // close the database connection
    db.close();
    }
    catch(err){
      console.error('handle the err: ', err)
    }
      
  }
  else{
    console.log('It seems that a problem just occur')
  }
  
})

//////////////////////// PUT /////////////////////////
// Permet de modifier les informations sur une news, lets gooooooo ça marche 

router.put('/news/:id', auth, function (req, res) {
  try{
  const title = req.body.title.trim();
  const subtitle = req.body.subtitle.trim();
  const contents = req.body.contents.trim();
  const publishingDate = req.body.publishingDate.trim();
  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = 'UPDATE news SET title = ?, subtitle = ? , contents = ? , publishingDate = ? WHERE idNews =?';
  
  db.run( sql,[title,subtitle,contents,publishingDate,req.params.id], function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'title' : title,
      'subtitle' : subtitle,
      'contents': contents,
      'publishingDate': publishingDate
    });
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// SPORTS ////////////////////////

//////////////////////// GET /////////////////////////
// Permet d'afficher les informations d'un sport(fonctionnel)


router.get('/sport/:id', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM sports WHERE idSport=?` ;
  
  // first row only
  db.get(sql,[req.params.id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(row);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})


//////////////////////// GET ALL /////////////////////////
// Permet d'afficher toutes les sports disponibles (fonctionnel)


router.get('/sport', function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  let sql = `SELECT * FROM sports`;
  
  // first row only
  db.all(sql, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  
  });
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// POST /////////////////////////
// Permet d'ajouter un sport, lets gooooooo ça marche 

router.post('/sport', function (req, res) {
  try{
  const sportName = req.body.sportName.trim();
  const sportDescription = req.body.sportDescription.trim();

  // open the database
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('INSERT INTO sports(sportName,sportDescription) VALUES(?,?)', [sportName,sportDescription], function(err){
    if (err){
      return console.log(err.message);
    }
    res.json({
      'sportName' : sportName,
      'sportDescription' : sportDescription,
    });
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})

//////////////////////// DELETE /////////////////////////
// Permet de supprimer une sport (fonctionnel)

router.delete('/sport/:id', auth, function (req, res) {
  // open the database
  try{
  let db = new sqlite3.Database('./dataBase.db');  
  
  db.run('DELETE FROM sports WHERE rowid=?', req.params.id, function(err){
    if (err){
      return console.log(err.message);
    }
    res.send('Sport deleted')
  })
  
  // close the database connection
  db.close();
  }
  catch(err){
    console.error('handle the err: ', err)
  }
})



module.exports = router;