const Notification = require("../models/Notification");

exports.updateNotifications = async (req, res, next) => {
    try {
        const { removePrefs, addPrefs } = req.body;
        const { userId } = req.params;
        const updateNotification = new Notification(userId, addPrefs, removePrefs);
        await updateNotification.update();
        res.status(200).json({});
    } catch (error) {
        next(error);
    }
};

exports.getNotificationPreferences = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const [teams, _] = await Notification.getPreferences(userId);

        const teamIds = [];
        teams.forEach(({ preference }) => {
            teamIds.push(preference);
        })
        res.status(200).json({ preferences: teamIds });
    } catch(err) {
        next(err);
    }
};
