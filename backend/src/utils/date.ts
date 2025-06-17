export const thirtyMinutesFromNow = () => new Date(Date.now() + 30 * 60 * 1000);

export const thirtyDaysFromNow = () =>
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
