var router = require('express').Router();


var tiradentesQueue = [];
var apoloQueue = [];

var getNewId = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + '-' + s4() + s4() + s4()+ s4() + s4()+ s4();
}

var checkOrphanPlayer = function(list) {
  if(list.length > 0) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if(element.length === 1){
        return {index:index, element: element};
      }
    };
    return;
  }else{
    return;
  }
}

var removePlayerFromQueue = function(playerIds, list) {
  if(playerIds.length === 1) {
    var playerId = playerIds[0];
    var elementIndex;
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if(element.length === 2){
        if(element[0].id === playerId || element[1].id === playerId){
          elementIndex = index;
        }
      }else{
        if(element[0].id === playerId){
          elementIndex = index;
        }
      }
    }
    if(elementIndex > -1){
      if(list[elementIndex].length === 1){
        list.splice(elementIndex, 1);
      }else{
        if(list[elementIndex][0].id === playerId){
          list[elementIndex].splice(0,1);
        }else{
          list[elementIndex].splice(1,1);
        }
      }
      return;
    }else{
      return 404;
    }
  } else {
    if(list[0][0].id === playerIds[0] && list[0][1].id === playerIds[1]) {
      list.shift();
    }else{
      return 400;
    }
  }
}

var insertPlayerIntoQueue = function(queueName, players){
  if(players.length === 2){
    queueName.push(players);
  }else{
    var orphan = checkOrphanPlayer(queueName);
    if(orphan) {
      orphan.element.push(players[0]);
      queueName[orphan.index] = orphan.element;
    }else{
      queueName.push(players);
    }
  }
}


router.get('/', function(req, res) {
  res.json({ tiradentes: tiradentesQueue, apolo: apoloQueue });
});

router.get('/:id', function(req, res) {
  switch(req.params.id){
    case 'tiradentes':
      res.json({ queue: tiradentesQueue });
      break;
    case 'apolo':
      res.json({ queue: apoloQueue });
      break;
    default:
      res.status(404);
    }
    res.send();
});

router.post('/:id', function(req, res){
  var players = [];
  if(req.body.playerone !== null && req.body.playerone !== ''
      && req.body.playerone !== undefined && req.body.playerone !== 'undefined'){
    players.push({id: getNewId(), name: req.body.playerone});
  }
  if(req.body.playertwo !== null && req.body.playertwo !== ''
      && req.body.playertwo !== undefined && req.body.playertwo !== 'undefined'){
    players.push({id: getNewId(), name: req.body.playertwo});
  }
  var errorStatus;
  if(players.length > 0){
    switch(req.params.id){
      case 'tiradentes':
        insertPlayerIntoQueue(tiradentesQueue, players);
        break;
      case 'apolo':
        insertPlayerIntoQueue(apoloQueue, players);
        break;
      default:
        errorStatus = 404;
    }
  }else{
    errorStatus = 400;
    
  }
  if(errorStatus){
    res.status(errorStatus);
  }
  console.log(tiradentesQueue);
  console.log(apoloQueue);
  console.log('------------------------------------------------')
  res.send();
});

router.delete('/:id', function(req, res){
  var playersToDelete = [];
  console.log(req.body.playerId);
  console.log(req.body.playertwoId);
  if(req.body.playerId !== null && req.body.playerId !== ''
      && req.body.playerId !== undefined && req.body.playerId !== 'undefined'){
    playersToDelete.push(req.body.playerId);
  }
  if(req.body.playertwoId !== null && req.body.playertwoId !== ''
      && req.body.playertwoId !== undefined && req.body.playertwoId !== 'undefined'){
        playersToDelete.push(req.body.playertwoId);
  }
  console.log(playersToDelete);
  
  var errorStatus;
  if(playersToDelete.length > 0){
    switch(req.params.id){
      case 'tiradentes':
        errorStatus = removePlayerFromQueue(playersToDelete, tiradentesQueue);
        break;
      case 'apolo':
        errorStatus = removePlayerFromQueue(playersToDelete, apoloQueue);
        break;
      default:
        errorStatus = 404;
    }
  } else {
    errorStatus = 400;
  }
  if(errorStatus){
    res.status(errorStatus);
  }
  console.log(tiradentesQueue);
  console.log(apoloQueue);
  console.log('------------------------------------------------')
  res.send();
});

module.exports = router;