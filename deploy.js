//name of sheetname for variable SeetName 
var sheetName = 'data' 
var scriptProp = PropertiesService.getScriptProperties()
function doGet (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {


    var doc = SpreadsheetApp.openById(scriptProp.getProperty('keyDaily'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var newRow = headers.map(function(header) {

      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])




                    
                        
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }
// ;
// let emailAddressOne = 'claimmoscow@gmail.com';
// let emailAddressTwo = 'handler.navo@gmail.com';
// 'https://www.google.com/maps/?q='+internetCoordinate
  finally {
  let emailAddressOne = 'info@shipsnavo.de'
  let emailAddressTwo = 'operations@coe2sea.com';
  let emailAddress = emailAddressOne+','+emailAddressTwo;
  let messageSubject = e.parameter['vesselImoSelector']+' '+e.parameter['dateOfReport']

  let internetCoordinate = coordinateTranslator(e.parameter['latDegree'],e.parameter['latMinutes'],e.parameter['latCardinalPoints'],e.parameter['lonDegree'],e.parameter['lonMinutes'],e.parameter['lonCardinalPoints'])

  let lat = internetCoordinate[0];
  let lon = internetCoordinate[1];
  

 const mapGoogle = Maps.newStaticMap()
 .setMapType(Maps.StaticMap.Type.HYBRID)
  .setCenter(lat,lon)
  .setSize(540, 240)
  .setZoom(12)
  .setMarkerStyle(Maps.StaticMap.MarkerSize.MID, Maps.StaticMap.Color.YELLOW, '1')
  .addMarker(lat,lon)
  .getBlob()
  .setName(e.parameter['VesselImoSelectorUnderScore']+'_'+"Google"+'_'+e.parameter['dateOfReport']);   

 const mapYandexurl = 'https://static-maps.yandex.ru/1.x/?lang=en_US&ll='+lon+','+lat+'&size=540,243&z=5&l=map&pt='+lon+','+lat+',pm2rdl1'

  var mapYandex = UrlFetchApp
                            .fetch(mapYandexurl)
                            .getBlob()
                            .setName(e.parameter['VesselImoSelectorUnderScore']+'_'+"Yandex"+'_'+e.parameter['dateOfReport']);   
var html = HtmlService.createTemplateFromFile("message");

html.vesselImoSelector= e.parameter['vesselImoSelector'];
html.dateOfReport= e.parameter['dateOfReport'];
html.timeInUtc= e.parameter['timeInUtc'];
html.shipTimeInUtcPlusOrMinus= e.parameter['shipTimeInUtcPlusOrMinus'];
html.voyageNumber= e.parameter['voyageNumber'];
html.fromPort= e.parameter['fromPort'];
html.toPort= e.parameter['toPort'];
html.distanceBetweenPoCs= e.parameter['distanceBetweenPoCs'];
html.steamTimeBetweenPoCs= e.parameter['steamTimeBetweenPoCs'];
html.speedOverGround= e.parameter['speedOverGround'];
html.heading= e.parameter['heading'];
html.distanceToGo= e.parameter['distanceToGo'];
html.latDegree= e.parameter['latDegree'];
html.latMinutes= e.parameter['latMinutes'];
html.latCardinalPoints= e.parameter['latCardinalPoints'];
html.lonDegree= e.parameter['lonDegree'];
html.lonMinutes= e.parameter['lonMinutes'];
html.lonCardinalPoints= e.parameter['lonCardinalPoints'];
html.idleDriftTime= e.parameter['idleDriftTime'];
html.cargoQty= e.parameter['cargoQty'];
html.ballastQty= e.parameter['ballastQty'];
html.gM= e.parameter['gM'];
html.conLsMgo= e.parameter['conLsMgo'];
html.lsMgo= e.parameter['lsMgo'];
html.vesselCondition= e.parameter['vesselCondition'];
html.draftFwd= e.parameter['draftFwd'];
html.draftAft= e.parameter['draftAft'];
html.robFreshWater= e.parameter['robFreshWater'];
html.conFreshWater= e.parameter['conFreshWater'];
html.robSludge= e.parameter['robSludge'];
html.robMeCircOil= e.parameter['robMeCircOil'];
html.meRpm= e.parameter['meRpm'];
html.exhaustGasTempAverageDegc= e.parameter['exhaustGasTempAverageDegc'];
html.exhaustGasTempMaxDegc= e.parameter['exhaustGasTempMaxDegc'];
html.mEUnitWithHighestExhTemp= e.parameter['mEUnitWithHighestExhTemp'];
html.robMGOLSInUseSuphurContent= e.parameter['robMGOLSInUseSuphurContent'];
html.robBilgeWater= e.parameter['robBilgeWater'];
html.loConsumptionSternTube= e.parameter['loConsumptionSternTube'];
html.loConsumptionCPP= e.parameter['loConsumptionCPP'];
html.loConsumptionReductionGearbox= e.parameter['loConsumptionReductionGearbox'];
html.loConsumptionBowthruster= e.parameter['loConsumptionBowthruster'];
html.loConsumptionHatchCover= e.parameter['loConsumptionHatchCover'];
html.comAuthor= e.parameter['comAuthor'];
html.comAlarmCodes= e.parameter['comAlarmCodes'];
html.comAlarmComments= e.parameter['comAlarmComments'];
html.dischBilgeWater= e.parameter['dischBilgeWater'];
html.dischSludge= e.parameter['dischSludge'];
html.dischGarbage= e.parameter['dischGarbage'];
html.captainInitials= e.parameter['captainInitials'];
html.vesselImoSelectorUnderScore= e.parameter['VesselImoSelectorUnderScore'];
    

 var htmlOutput = html.evaluate().getContent()

var vesselName = e.parameter['vesselImoSelector']

MailApp.sendEmail(emailAddress, messageSubject, "",
                    { htmlBody: htmlOutput,
                      replyTo:'handler.navo@gmail.com',
                       name: vesselName,
                      inlineImages:
                      {
                        mapYa: mapYandex,
                        mapGo: mapGoogle,
                        
                      }
                    });
    lock.releaseLock()
  }
  
}

