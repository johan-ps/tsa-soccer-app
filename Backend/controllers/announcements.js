const Announcement = require("../models/Announcement");
const sharp = require('sharp');

exports.getAllAnnouncements = async (req, res, next) => {
    try {
        const [announcements, _] = await Announcement.findAll();

        res.status(200).json({ announcements: announcements || [] });
    } catch (error) {
        next(error);
    }
};

exports.getAllAnnouncementsByTeams = async (req, res, next) => {
    try {
        const { teams = null } = req.body;
        const [announcements, _] = await Announcement.findAllByTeams(teams || []);
        
        res.status(200).json({ announcements: announcements || [] });
    } catch (error) {
        next(error);
    }
};

exports.addAnnouncement = async (req, res, next) => {
    try {
        let { title = null, description, authorId, teams, image = null } = req.body;
        let isValid = true, errors = [];

        if (teams) {
            teams = JSON.parse(teams);
        }

        if (!description || description.length === 0) {
            isValid = false;
            errors.push({
                errCode: '0001',
                field: 'description',
            });
        }
        
        if (!teams || teams.length === 0) {
            isValid = false;
            errors.push({
                errCode: '0002',
                field: 'teams',
            });
        }
        
        if (isValid) {
            let imageBuffer = req.file;
            if (imageBuffer && imageBuffer.buffer) {
                imageBuffer = imageBuffer.buffer
                const { width, height } = await sharp(imageBuffer).metadata();
                imageBuffer = await sharp(imageBuffer).resize({ height: 300 }).toBuffer();
                image = `data:${req.file.mimetype};base64,` + imageBuffer.toString('base64');
            }
            
            const newAnnouncement = new Announcement(title, description, authorId, teams, image);
            const [announcement, _] = await newAnnouncement.save();
            await newAnnouncement.saveTeams(announcement.insertId);
            res.status(200).json({ announcement: { ...newAnnouncement, id: announcement.insertId } })
        } else {
            res.status(400).json({ errors });
        }
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