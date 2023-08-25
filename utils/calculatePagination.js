const calculatePagination = (page) => {
  const PAGE_SIZE = 10;
  const pageNumber = Number.isInteger(page) && page > 0 ? page : 1;
  const skipCount = (pageNumber - 1) * PAGE_SIZE;
  
  return {
    limit: PAGE_SIZE,
    skip: skipCount
  }
}

export default calculatePagination