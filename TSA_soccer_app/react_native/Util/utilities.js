export const getDate = date => {
  date = new Date(date);
  const curDate = new Date();
  const tmrwDate = new Date(curDate);
  tmrwDate.setDate(tmrwDate.getDate() + 1);
  if (
    date.getFullYear() === curDate.getFullYear() &&
    date.getMonth() === curDate.getMonth() &&
    date.getDate() === curDate.getDate()
  ) {
    return 'Today';
  } else if (
    date.getFullYear() === tmrwDate.getFullYear() &&
    date.getMonth() === tmrwDate.getMonth() &&
    date.getDate() === tmrwDate.getDate()
  ) {
    return 'Tomorrow';
  } else {
    return prettyPrintDate(date);
  }
};

export const formatStatus = status => {
  return (
    status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase()
  );
};

export const formatTime = time => {
  let hours = time.getHours() % 12;
  let min = time.getMinutes();
  let suffix;
  if (time.getHours() > 12) {
    suffix = ' pm';
  } else {
    suffix = ' am';
  }
  if (min < 10) {
    min = min + '0';
  }
  if (hours === 0) {
    hours = 12;
  }
  return hours + ':' + min + suffix;
};

export const getTime = date => {
  date = new Date(date);
  const curDate = new Date();
  const tmrwDate = new Date(curDate);
  tmrwDate.setDate(tmrwDate.getDate() + 1);
  if (
    date.getFullYear() === curDate.getFullYear() &&
    date.getMonth() === curDate.getMonth() &&
    date.getDate() === curDate.getDate()
  ) {
    const hours = date.getHours();
    const min = date.getMinutes();
    const hourDif = curDate.getHours() - hours;
    const minDif = curDate.getMinutes() - min;
    if (hourDif === 0) {
      if (minDif === 1) {
        return '1 minute ago';
      } else {
        return minDif + ' minutes ago';
      }
    } else if (hourDif === 1) {
      return '1 hour ago';
    } else {
      return hourDif + ' hours ago';
    }
  } else {
    return prettyPrintDate(date);
  }
};

export const prettyPrintDate = date => {
  date = new Date(date);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  return (
    daysOfWeek[date.getDay()] +
    ', ' +
    months[date.getMonth()] +
    ' ' +
    date.getDate() +
    ', ' +
    date.getFullYear()
  );
};

export const sortByDate = data => {
  function compareDate(a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }
  data.sort(compareDate);
  return data;
};

export const formatTeams = teams => {
  const teamsOpt = [
    {
      label: 'House League',
      id: 0,
      children: [],
    },
    {
      label: 'Rep',
      id: 1,
      children: [],
    },
  ];
  teams.forEach(team => {
    if (team.type === 'rep') {
      teamsOpt[1].children.push({ ...team, label: team.name });
    } else {
      teamsOpt[0].children.push({ ...team, label: team.name });
    }
  });
  return teamsOpt;
};
