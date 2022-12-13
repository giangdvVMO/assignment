export const DateToShortString = (dateString) => {
  console.log(dateString);
  const date = new Date(dateString);
  return (
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  );
};
