const Announcement = require("../models/Announcement");
const sharp = require('sharp');

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
        
        let imageBuffer = req.file.buffer;
        const { width, height } = await sharp(imageBuffer).metadata();
        imageBuffer = await sharp(imageBuffer).resize({ height: 300 }).toBuffer();
        image = `data:${req.file.mimetype};base64,` + imageBuffer.toString('base64');
        
        const newAnnouncement = new Announcement(title, description, authorId, teams, image);
        const [announcement, _] = await newAnnouncement.save();
        await newAnnouncement.saveTeams(announcement.insertId);
        res.status(200).json({ announcement: { ...newAnnouncement, id: announcement.insertId } })
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