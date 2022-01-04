
const { admin } = require('../config/firebase');

exports.sendAnnouncementNotification = (announcementData, teams) => {
    teams.forEach(({ teamId, name }) => {
        const message = {
            data: {
                id: announcementData.id.toString(),
                type: 'announcement',
                name: announcementData.name,
                description: announcementData.description,
                teamName: name,
            },
            topic: `Team${teamId}`,
            android: {
                priority: "high"
            },
        };
          
        admin.messaging().send(message).then(res => {}).catch(err => {});
    })
};