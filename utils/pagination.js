export default {
  prisma: (limit, skip) => {
    const pageNumber = parseInt(skip) || 1;
    const pageSize = parseInt(limit) || 10;
  
    return {
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    }
  },

  meta: (total, limit, skip) => {
    const pageNumber = parseInt(skip) || 1;
    const pageSize = parseInt(limit) || 10;
  
    return {
      meta: {
        total,
        limit: pageSize,
        skip: (pageNumber - 1) * pageSize,
      }
    }
  }
}



