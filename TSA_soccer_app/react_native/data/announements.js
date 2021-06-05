import Announcement from '../models/announcement';

const desc = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dui sapien, gravida at justo et, dapibus malesuada odio. Morbi eget fermentum lacus. Aenean dictum mauris nibh,`;
const title = 'New Album Release';
export const Announcements = [
    new Announcement(0, new Date(2020, 3, 4, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1545559054-8f4f9e855781?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
    new Announcement(1, new Date(2020, 3, 3, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1558258695-39d4595e049c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
    new Announcement(2, new Date(2020, 3, 2, 1, 40, 0), title, desc, 'info', 'Gryffin', null),
    new Announcement(3, new Date(2020, 3, 1, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1536536982624-06c1776e0ca8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
    new Announcement(4, new Date(2020, 2, 31, 1, 40, 0), title, desc, 'info', 'Gryffin', null),
    new Announcement(5, new Date(2020, 2, 15, 1, 40, 0), title, desc, 'info', 'Gryffin', null),
    new Announcement(6, new Date(2020, 2, 7, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1543793870-4317361ff7e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
    new Announcement(7, new Date(2020, 2, 4, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1550184816-3eeadf82295f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
    new Announcement(8, new Date(2020, 2, 2, 1, 40, 0), title, desc, 'info', 'Gryffin', null),
    new Announcement(9, new Date(2020, 2, 1, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1549074699-3761f0ecc66a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
    new Announcement(10, new Date(2020, 1, 24, 1, 40, 0), title, desc, 'info', 'Gryffin', null),
    new Announcement(11, new Date(2020, 0, 13, 1, 40, 0), title, desc, 'info', 'Gryffin', 'https://images.unsplash.com/photo-1562873656-4fbe35b24826?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'),
]