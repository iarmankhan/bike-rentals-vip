export const getAverageRating = (rating: Record<string, number>): number => {
  const allRatings = Object.values(rating);
  return allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length;
};
