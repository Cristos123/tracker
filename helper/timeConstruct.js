exports.timeConstruct = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const years = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const days = new Date().getDate();
  return {
    years,
    month,
    days,
    hour,
    minutes,
  };
};
