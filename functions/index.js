const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
admin.initializeApp();

exports.autoEscalation = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const dayAgo = new Date(now.toDate().getTime() - (24 * 60 * 60 * 1000));

    const snapshots = await admin.firestore().collection('complaints')
        .where('status', '==', 'Pending')
        .where('created_at', '<', admin.firestore.Timestamp.fromDate(dayAgo))
        .get();

    const batch = admin.firestore().batch();
    snapshots.forEach(doc => {
        batch.update(doc.ref, { escalation_level: 1, status: 'Escalated' });
    });

    return batch.commit();
});