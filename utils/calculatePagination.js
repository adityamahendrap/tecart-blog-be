const calculatePagination = (page) => {
  const PAGE_SIZE = 20;
  const pageNumber = page ?? 1;
  const skipCount = (pageNumber - 1) * PAGE_SIZE;

  return {
    limit: PAGE_SIZE,
    skip: skipCount
  }
}

export default calculatePagination