// ============================================================
// Google Apps Script — "Facts, or Faith?" live vote backend
// (extends the BIMSB how_to_single_cell vote collector)
//
// SETUP:
// 1. Create a new Google Sheet.
// 2. Extensions > Apps Script.
// 3. Paste this whole file into the editor (replace any contents).
// 4. Deploy > New deployment > type "Web app":
//      - Execute as: Me
//      - Who has access: Anyone
// 5. Copy the deployment URL (ends in /exec).
// 6. Paste it into GOOGLE_SCRIPT_URL in app.js.
// 7. Set a presenter key below (PRESENTER_KEY) and use the same
//    value in your presenter URL:  ...?teacher=true&key=YOURKEY
//
// REDEPLOY after edits:
//   Deploy > Manage deployments > Edit (pencil) > Version: New > Deploy
//
// Endpoints (all GET):
//   ?action=state                         -> { currentQuestion }
//   ?action=setState&q=N&key=KEY          -> sets the live question
//   ?action=vote&deviceId=&topicId=&vote= -> records a vote (facts|faith)
//   ?action=results                       -> { deviceCount, results:{id:{facts,faith}} }
// ============================================================

var PRESENTER_KEY = 'changeme';   // <-- change this; must match ?key= in the presenter URL

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var action = p.action || 'results';
    if (action === 'vote')     return handleVote(p);
    if (action === 'state')    return handleState();
    if (action === 'setState') return handleSetState(p);
    if (action === 'reset')    return handleReset(p);
    return handleResults();
  } catch (err) {
    return json({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    var data = (e && e.parameter) || {};
    if (!data.deviceId && e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (ex) {}
    }
    return handleVote(data);
  } catch (err) {
    return json({ status: 'error', message: err.toString() });
  }
}

// ── Presenter-locked state (stored in Script Properties) ─────
function handleState() {
  var q = PropertiesService.getScriptProperties().getProperty('currentQuestion');
  return json({ status: 'ok', currentQuestion: Number(q || 0) });
}

function handleSetState(p) {
  if (String(p.key) !== String(PRESENTER_KEY)) {
    return json({ status: 'error', message: 'bad key' });
  }
  PropertiesService.getScriptProperties().setProperty('currentQuestion', String(Number(p.q || 0)));
  return json({ status: 'ok', currentQuestion: Number(p.q || 0) });
}

// Clear all votes (keeps the header row). Presenter-key protected.
function handleReset(p) {
  if (String(p.key) !== String(PRESENTER_KEY)) {
    return json({ status: 'error', message: 'bad key' });
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var last = sheet.getLastRow();
  if (last > 1) sheet.deleteRows(2, last - 1);
  return json({ status: 'ok', cleared: true });
}

// ── Votes ────────────────────────────────────────────────────
function handleVote(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'deviceId', 'topicId', 'topicTitle', 'vote', 'answer']);
  }
  sheet.appendRow([
    new Date().toISOString(),
    data.deviceId || '',
    data.topicId  || '',
    data.topicTitle || '',
    data.vote     || '',
    data.answer   || ''
  ]);
  return json({ status: 'ok' });
}

function handleResults() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() <= 1) {
    return json({ status: 'ok', deviceCount: 0, results: {} });
  }
  var data = sheet.getDataRange().getValues();
  var votes = {}, devices = {};
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var deviceId = String(row[1]);
    var topicId  = String(row[2]);
    var vote     = String(row[4]);
    var key = deviceId + '_' + topicId;                 // latest vote per device per topic
    if (!votes[key] || new Date(row[0]) > new Date(votes[key].timestamp)) {
      votes[key] = { timestamp: row[0], topicId: topicId, vote: vote, deviceId: deviceId };
    }
    devices[deviceId] = true;
  }
  var results = {};
  for (var k in votes) {
    var v = votes[k];
    if (!results[v.topicId]) results[v.topicId] = { facts: 0, faith: 0 };
    if (results[v.topicId][v.vote] !== undefined) results[v.topicId][v.vote]++;
  }
  return json({ status: 'ok', deviceCount: Object.keys(devices).length, results: results });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
