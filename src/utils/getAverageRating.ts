export const getAverageRating = (rating: Record<string, number>) => {
  const allRatings = Object.values(rating);
  const avgRating =
    allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length;
  return parseFloat(avgRating.toFixed(2));
};
