const constants = {
  NO_RESULTS: 'NO_RESULTS',
  NO_RESULTS_HEADING: 'No results found',
  NO_RESULTS_SUBHEADING:
    "We couldn't find any results. Change selected filters or try later.",
  NO_RESULTS_IMG: 'magnifying-glass.png',
  NO_INTERNET: 'NO_INTERNET',
  NO_INTERNET_HEADING: 'No internet connection',
  NO_INTERNET_SUBHEADING:
    'There seems to be a problem with your Network Connection',
  NO_INTERNET_IMG: 'internet-slash.png',
  AUTH_TOKEN_KEY: 'tsaAuthToken',
  NOTIFICATION_KEY: 'tsaNotificationKey',
  REPEATS: [
    {
      children: [
        {
          name: 'Every Monday',
          id: 0,
        },
        {
          name: 'Every Tuesday',
          id: 1,
        },
        {
          name: 'Every Wednesday',
          id: 2,
        },
        {
          name: 'Every Thursday',
          id: 3,
        },
        {
          name: 'Every Friday',
          id: 4,
        },
        {
          name: 'Every Saturday',
          id: 5,
        },
        {
          name: 'Every Sunday',
          id: 6,
        }
      ]
    }],
};

export default constants;
