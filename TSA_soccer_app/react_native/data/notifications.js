import Notification from '../models/notification';

export const Notifications = [
    new Notification(0, new Date(2020, 5, 24, 17, 40, 0), 'Practice has been cancelled this Wednesday due to inclement weather',
    'error', false, true),
    new Notification(0, new Date(2020, 5, 24, 17, 40, 0), 'Practice has been cancelled this Wednesday due to inclement weather',
    'warning', false, true),
    new Notification(0, new Date(2020, 5, 24, 17, 40, 0), 'Practice has been cancelled this Wednesday due to inclement weather',
    'info', false, true),
    new Notification(0, new Date(2020, 5, 24, 17, 40, 0), 'Practice has been cancelled this Wednesday due to inclement weather',
    'success', false, true),
]