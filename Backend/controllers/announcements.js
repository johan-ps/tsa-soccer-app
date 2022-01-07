const Announcement = require("../models/Announcement");
const sharp = require('sharp');
const notification = require('../utils/notifications');

exports.getAllAnnouncements = async (req, res, next) => {
    try {
        const [announcements, _] = await Announcement.findAll();

        res.status(200).json({ announcements: announcements || [] });
    } catch (error) {
        next(error);
    }
};

exports.getAllAnnouncementsByFilters = async (req, res, next) => {
    try {
        const { teams = null, startDate = null, endDate = null } = req.body;
        let isValid = true, errors = [];

        if (startDate && endDate) {
            if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
                isValid = false;
                errors.push({
                    errCode: '0003',
                    field: 'startDate',
                })
            }
        }

        if (isValid) {
            const [announcements, _] = await Announcement.findAllByFilters({ teams, startDate, endDate});

            res.status(200).json({ announcements: announcements || [] });
        } else {
            res.status(400).json({ errors });
        }
    } catch (error) {
        next(error);
    }
};

exports.addAnnouncement = async (req, res, next) => {
    try {
        const { title = null, description, authorId } = req.body;
        let { teams, image = null } = req.body;
        const errors = [];
        let isValid = true;

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
            const [authorData, temp] = await Announcement.getAuthor(authorId);
            const [a_teams, temp2] = await Announcement.findTeams(announcement.insertId);
            res.status(200).json({ announcement: { ...newAnnouncement, id: announcement.insertId, ...authorData[0] } });
            notification.sendAnnouncementNotification({...newAnnouncement, name: authorData[0].lastName, id: announcement.insertId }, a_teams);
        } else {
            res.status(400).json({ errors });
        }
    } catch (error) {
        next(error);
    }
}

exports.getTeamsFromAnnouncements = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [teams, _] = await Announcement.findTeams(id);
        
        res.status(200).json({ teams });
    } catch (error) {
        next(error);
    }
}

exports.updateById = async (req, res, next) => {
    try {
        const { title = null, description, authorId } = req.body;
        let { teams, image = null } = req.body;
        const { id } = req.params;
        const errors = [];
        let isValid = true;

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
            await Announcement.deleteAnnouncementsTeams(id);
            const [announcement, _] = await newAnnouncement.update(id);
            await newAnnouncement.saveTeams(id);
            res.status(200).json({ announcement: { ...newAnnouncement, id } })
        } else {
            res.status(400).json({ errors });
        }
    } catch (error) {
        next(error);
    }
}

exports.deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Announcement.deleteAnnouncementsTeams(id);
        await Announcement.deleteAnnouncements(id);
        res.status(200).json({ success: true, announcementId: id })
    } catch (error) {
        next(error);
    }
}

exports.downloadImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [image, _] = await Announcement.getImage(id);

        let base64Str = image[0].image;
        const type = base64Str.substring("data:image/".length, base64Str.indexOf(";base64"))
        base64Str = base64Str.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const img = Buffer.from(base64Str, "base64");

        res.writeHead(200, {
            'Content-Type': `image/${type}`,
            'Content-Length': img.length,
        });
        res.end(img);
    } catch (error) {
        next(error);
    }
};
