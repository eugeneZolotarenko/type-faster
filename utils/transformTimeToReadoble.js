export function transformTimeToReadable(time) {
  let timeLeft = time === 60 ? '1:00' : `0:${time}`;

  const lengthOfTime = time.toString().split('').length;
  if (lengthOfTime <= 1) {
    timeLeft = `0:0${time}`;
  }
  return timeLeft;
}
