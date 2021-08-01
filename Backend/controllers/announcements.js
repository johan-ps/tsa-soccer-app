const Announcement = require("../models/Announcement");

exports.getAllAnnouncements = async (req, res, next) => {
    try {
        const [announcements, _] = await Announcement.findAll();

        res.status(200).json({ announcements });
    } catch (error) {
        next(error);
    }
};

exports.getAnnouncementsByTeam = async (req, res, next) => {
    return null
}

exports.addAnnouncement = async (req, res, next) => {
    try {
        let { title = null, description, authorId, teams, image = null } = req.body;
        let announcement = new Announcement(title, description, authorId, teams, image);
        
        const [newAnnouncement, _] = await announcement.save()
        res.status(200).json({ announcement })
    } catch (error) {
        next(error);
    }
}

exports.updateById = async (req, res, next) => {
    return null
}

exports.deleteById = async (req, res, next) => {
    return null
}