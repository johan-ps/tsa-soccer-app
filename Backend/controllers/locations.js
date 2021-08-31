const Location = require("../models/Location");

exports.getAllLocations = async (req, res, next) => {
    try {
        const [locations, _] = await Location.findAll();

        res.status(200).json({ locations });
    } catch (error) {
        next(error);
    }
};

exports.getLocationById = async (req, res, next) => {
  try {
    let { id } = req.body;
    const [locations, _] = await Location.findById(id);

    res.status(200).json({ locations });
  } catch (error) {
      next(error);
  }
}

exports.createLocation = async (req, res, next) => {
    try {
        console.log("Joell req", req.body);
        let { name, street, city, province, postalCode, country, latitude, longitude } = req.body;
        const newLocation = new Location(name, street, city, province, postalCode, country, latitude, longitude);
        console.log("Joell newLocation", newLocation);
        const [location, _] = await newLocation.save();
        res.status(200).json({ location: { ...newLocation, id: location.insertId } })
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