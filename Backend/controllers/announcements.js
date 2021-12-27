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
            res.status(200).json({ announcement: { ...newAnnouncement, id: announcement.insertId } })
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