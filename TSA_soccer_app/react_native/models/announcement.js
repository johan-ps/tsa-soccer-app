class Announcement {
  constructor(
    id,
    date,
    title,
    description,
    type,
    author,
    imageUrl,
    authorImgUrl,
  ) {
    this.id = id;
    this.date = date;
    this.title = title;
    this.description = description;
    this.type = type;
    this.author = author;
    this.imageUrl = imageUrl;
    this.authorImgUrl = authorImgUrl;
  }
}

export default Announcement;
