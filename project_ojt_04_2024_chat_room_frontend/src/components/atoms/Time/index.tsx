import React from 'react';
import moment from 'moment';

interface Props {
  timestamp: Date | undefined | string;
}

const TimeDisplay: React.FC<Props> = ({ timestamp }) => {
  const currentTime = moment();
  const messageTime = moment(timestamp);

  let formattedTime;

  if (currentTime.isSame(messageTime, 'day')) {
    formattedTime = messageTime.format('HH:mm');
  } else if (currentTime.isSame(messageTime, 'month')) {
    formattedTime = messageTime.format('DD/MM');
  } else if (currentTime.isSame(messageTime, 'year')) {
    formattedTime = messageTime.format('DD/MM');
  } else {
    formattedTime = messageTime.format('DD/MM/YYYY');
  }

  return <span>{formattedTime}</span>;
};

export default TimeDisplay;
