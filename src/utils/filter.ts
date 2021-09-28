export const F_ToTime = (time: number) => {
  function Fn(x: number) {
    if (x < 10) return `0${x}`;
    if (x === 0) return '00';
    return x;
  }
  // eslint-disable-next-line no-param-reassign
  time = Math.floor(time);
  let h: number;
  let m: number;
  let s: number;
  switch (true) {
    case time >= 3600:
      h = parseInt(`${time / 3600}`, 10);
      m = parseInt(`${(time - h * 3600) / 60}`, 10);
      s = parseInt(`${time - h * 3600 - m * 60}`, 10);
      return `${Fn(h)}:${Fn(m)}:${Fn(s)}`;
    case time >= 60 && time < 3600:
      m = parseInt(`${time / 60}`, 10);
      s = parseInt(`${time - m * 60}`, 10);
      return `00:${Fn(m)}:${Fn(s)}`;
    case time > 0 && time < 60:
      s = time;
      return `00:00:${Fn(s)}`;
    default:
      return '00:00:00';
  }
};
