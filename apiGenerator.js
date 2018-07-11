const WorldState = require('warframe-worldstate-parser');
const fs = require('fs');

//setInterval(function() {
//generateAPIAlerts(ws, 'ps4', 'http://content.ps4.warframe.com/dynamic/worldState.php');
//generateAPIAlerts(ws, 'xb1', 'http://content.xb1.warframe.com/dynamic/worldState.php');

//}, 100000);

exports.generatePlataformAPIs = async function(plataform) {
  var url = 'http://content.warframe.com/dynamic/worldState.php';
  if(plataform != 'pc') {url = 'http://content.'+plataform+'.warframe.com/dynamic/worldState.php'};

  const worldstateData = await (require('request-promise'))(url);
  const ws = new WorldState(worldstateData);

  generateAlertsFile(ws, plataform);
  //generateInvasionsFile(ws, plataform);
}

function generateAlertsFile(ws, plataform) {
  var alerts = ws.alerts, alertsJson = [];

  alerts.forEach(function(alert) {
    var mission = alert.mission, alertJson = {};

    alertJson.location = mission.node;
    alertJson.type = mission.type;
    alertJson.faction = mission.faction;
    alertJson.time = alert.eta;
    alertJson.level = mission.minEnemyLevel+'-'+mission.maxEnemyLevel;

    alertJson.rewards = [];
    alert.mission.reward.items.forEach(function(item) {
      if(item.length > 0 || item != '')
        alertJson.rewards.push(item);
    });
    alert.mission.reward.countedItems.forEach(function(item) {
      if(item.length > 0 || item != '')
        alertJson.rewards.push(item.count+' '+item.type);
    });
    alertJson.credits = mission.reward.credits+'cr';
    alertsJson.push(alertJson);
  });

  fs.writeFile('./api/'+plataform+'Alerts.json', JSON.stringify(alertsJson), function(err) {
    if(err) {throw err;}
    console.log(plataform+' Alerts JSON Updated');
  }); 
}

function generateInvasionsFile(ws, plataform) {
  var invasions = ws.invasions, invasionsJson = [];
  console.log(invasions);
  invasions.forEach(function(invasion) {

    invasionJson.attackerReward = [];
    invasion.mission.reward.items.forEach(function(item) {
      if(item.length > 0 || item != '')
        alertJson.rewards.push(item);
    });
    alert.mission.reward.countedItems.forEach(function(item) {
      if(item.length > 0 || item != '')
        alertJson.rewards.push(item.count+' '+item.type);
    });
  });

  fs.writeFile('./api/'+plataform+'Invasions.json', JSON.stringify(invasionsJson), function(err) {
    if(err) {throw err;}
    console.log(plataform+' Invasions JSON Updated');
  });
}