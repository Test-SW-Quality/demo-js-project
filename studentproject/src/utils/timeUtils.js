export const createTimeStamp = (hours, minutes) => {
  let stampMinutes = Math.ceil(minutes / 15) * 15;
  let stampHours = hours % 12 || 12;
  let ampm = hours >= 12 ? 'PM' : 'AM';

  if (stampMinutes >= 60) {
    stampMinutes = 0;
    hours += 1;

    stampHours = hours % 12 || 12;
    ampm = hours >= 12 && hours < 24 ? 'PM' : 'AM';
  }

  const formattedMinutes = stampMinutes < 10 ? '0' + stampMinutes : stampMinutes;

  let secondStampMinutes = parseInt(stampMinutes) + 15;
  let secondStampHours = hours % 12 || 12;
  let secondAmpm = hours >= 12 ? 'PM' : 'AM';
  if (secondStampMinutes >= 60) {
    secondStampMinutes = 0;
    secondStampHours += 1;

    secondStampHours = secondStampHours % 12 || 12;
    // ! DO NOT REMOVE THIS COMMENT YET, I DONT KNOW WHY THIS IS HERE "YET"
    // secondAmpm = secondStampHours >= 12 && secondStampHours < 24 ? 'PM' : 'AM';
  }

  const formattedSecondStampMinutes = secondStampMinutes < 10 ? '0' + secondStampMinutes : secondStampMinutes;

  return [
    `${stampHours}:${formattedMinutes} ${ampm}`,
    `${secondStampHours}:${formattedSecondStampMinutes} ${secondAmpm}`,
  ];
};

export const secondTimeStampHandler = (curr) => {
  let [currHour, currMinuteWithAmPm] = curr.split(':');
  let [currMinute, ampm] = currMinuteWithAmPm.split(' ');
  currHour = parseInt(currHour);
  currMinute = parseInt(currMinute);
  const increment = 15;
  let newMinute = currMinute + increment;

  if (newMinute >= 60) {
    currHour += 1;
    newMinute = newMinute % 60;
  }

  if (currHour === 12 && newMinute === 0) {
    ampm = ampm === 'AM' ? 'PM' : 'AM';
  } else if (currHour > 12) {
    currHour = currHour % 12;
    if (currHour === 0) currHour = 12;
    ampm = ampm === 'AM' ? 'PM' : 'AM';
  }

  const formattedMinute = newMinute < 10 ? '0' + newMinute : newMinute;
  return `${currHour}:${formattedMinute} ${ampm}`;
};

export const generateTimeStamps = (curr) => {
  let timeStamps = [];
  const totalIntervals = 94;
  let [currHour, currMinuteWithAmPm] = curr.split(':');
  let [currMinute] = currMinuteWithAmPm.split(' ');
  let hours = parseInt(currHour);
  let minutes = parseInt(currMinute);
  if (minutes >= 60) {
    minutes -= 60;
    hours = (hours + 1) % 24;
  }

  for (let i = 0; i < totalIntervals; i++) {
    let currentTimeStamp = formatTimeStamp(hours, minutes);
    timeStamps.push(currentTimeStamp);

    minutes += 15;
    if (minutes >= 60) {
      minutes = 0;
      hours = (hours + 1) % 24;
    }
  }

  const cutOffIndex = timeStamps.indexOf(curr);
  timeStamps = timeStamps.slice(cutOffIndex);
  return timeStamps;
};

const formatTimeStamp = (hours, minutes) => {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const timeDifferences = (firstTimeStamp, secondTimeStamps) => {
  const parseTime = (time) => {
    if (!time) return { hour: 0, minute: 0 };

    const parts = time.split(':');
    if (parts.length < 2) return { hour: 0, minute: 0 };

    const [hour, minuteWithAmPm] = parts;
    const minuteParts = minuteWithAmPm.split(' ');
    if (minuteParts.length < 2) return { hour: 0, minute: 0 };

    const [minute, ampm] = minuteParts;
    let hourInt = parseInt(hour, 10);
    const minuteInt = parseInt(minute, 10);

    if (ampm === 'PM' && hourInt < 12) hourInt += 12;
    else if (ampm === 'AM' && hourInt === 12) hourInt = 0;

    return { hour: hourInt, minute: minuteInt };
  };

  const firstTime = parseTime(firstTimeStamp);

  return secondTimeStamps.map((secondTimeStamp) => {
    const secondTime = parseTime(secondTimeStamp);
    let diffHour = secondTime.hour - firstTime.hour;
    let diffMinute = secondTime.minute - firstTime.minute;

    if (diffMinute < 0) {
      diffHour -= 1;
      diffMinute += 60;
    }

    if (diffHour < 0) {
      diffHour += 24;
    }

    if (diffHour === 23 && diffMinute >= 40) {
      diffHour -= 24;
    }

    const diffHourAbs = Math.abs(diffHour);
    const diffMinuteAbs = Math.abs(diffMinute);

    return `${secondTimeStamp} (${
      diffHourAbs > 0 ? diffHourAbs + ' hours ' : ''
    }${diffMinuteAbs > 0 ? diffMinuteAbs + ' Min' : ''})`.trim();
  });
};

export function ignoreTimezoneIso(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}
