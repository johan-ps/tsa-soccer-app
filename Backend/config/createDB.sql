CREATE TABLE heroku_255da0fd4009d26.announcements (
  id INT NOT NULL AUTO_INCREMENT,
  date DATETIME NOT NULL,
  title VARCHAR(45) NULL,
  description VARCHAR(5000) NOT NULL,
  authorId INT NOT NULL,
  image LONGTEXT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (authorId) REFERENCES USERS(id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.users (
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(20) NOT NULL,
  lastName VARCHAR(45),
  profileImg LONGTEXT,
  email VARCHAR(100),
  phoneNum VARCHAR(11),
  role ENUM('coach', 'player') NOT NULL,
  position VARCHAR(20) NOT NULL,
  accessLevel INT NOT NULL,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(20) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username_UNIQUE (username ASC)
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.teams (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  ageGroup VARCHAR(5) NOT NULL,
  type ENUM('rep', 'houseLeague'),
  PRIMARY KEY (id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.teams_users (
  id INT NOT NULL AUTO_INCREMENT,
  teamId INT NOT NULL,
  userId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (teamId) REFERENCES TEAMS(id),
  FOREIGN KEY (userId) REFERENCES USERS(id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.announcements_teams (
  id INT NOT NULL AUTO_INCREMENT,
  announcementId INT NOT NULL,
  teamId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (announcementId) REFERENCES ANNOUNCEMENTS(id),
  FOREIGN KEY (teamId) REFERENCES TEAMS(id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.events (
  id INT NOT NULL AUTO_INCREMENT,
  type VARCHAR(20) NOT NULL,
  date DATETIME NOT NULL,
  timeTBD BOOLEAN,
  startTime TIME,
  endTime TIME,
  locationId INT NOT NULL,
  locationDetails VARCHAR(45),
  authorId INT NOT NULL,
  notes VARCHAR(100),
  status ENUM('approved', 'cancelled') NOT NULL,
  notifyTeam BOOLEAN NOT NULL,
  opponent VARCHAR(45),
  jersey ENUM('home', 'away'),
  arriveEarly BOOLEAN NOT NULL,
  teamId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (authorId) REFERENCES USERS(id),
  FOREIGN KEY (locationId) REFERENCES LOCATIONS(id),
  FOREIGN KEY (teamId) REFERENCES TEAMS(id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.locations (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  street VARCHAR(45) NOT NULL,
  city VARCHAR(20) NOT NULL,
  province VARCHAR(20) NOT NULL,
  postalCode VARCHAR(6) NOT NULL,
  country VARCHAR(20) NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.availability (
  id INT NOT NULL AUTO_INCREMENT,
  eventId INT NOT NULL,
  playerId INT NOT NULL,
  status ENUM('going', 'maybe', 'unavailable'),
  PRIMARY KEY (id),
  FOREIGN KEY (eventId) REFERENCES EVENTS(id),
  FOREIGN KEY (playerId) REFERENCES USERS (id),
  UNIQUE INDEX ID_UNIQUE (id ASC));

CREATE TABLE heroku_255da0fd4009d26.notification (
  id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  preference INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES USERS(id),
  UNIQUE INDEX ID_UNIQUE (id ASC));
