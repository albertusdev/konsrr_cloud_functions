const functions = require("firebase-functions").region('asia-southeast2'); // Jakarta server

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const withEnableCORS = (wrapped) => (req, res) => {
  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s

  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    wrapped(req, res);
  }
};

exports.updateSeenBy = functions.https.onRequest(
  withEnableCORS(async (req, res) => {
    if (req.method === "POST") {
      const concertId = req.body['concertId'];
      if (!concertId) {
        res.send('concertId is a required parameter. Please specify');
        return;
      }
      const concertRef = db.collection("concerts").doc(concertId);
      const concertDoc = await (concertRef.get());
      if (!concertDoc.exists) {
        res.status(404).send(`Concert with concertId: ${concertId} not found.`);
      }
      concertRef.update({ seenBy: increment });
      res.status(200).send(`Success updating seen by! request: ${JSON.stringify(req.body)}`);
    } else {
      res.status()
      res.status(405).send(`Method ${req.method} not allowed`);
    }
  })
);
