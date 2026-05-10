/**
 * Applies pagination to a Mongoose query.
 * @param {import('mongoose').Query} query - The Mongoose query to paginate
 * @param {object} options - { page, limit }
 * @returns {{ data, pagination }} - Paginated results with metadata
 */
const paginate = async (query, { page = 1, limit = 10 }) => {
  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

  const skip = (page - 1) * limit;

  const [data, totalDocs] = await Promise.all([
    query.clone().skip(skip).limit(limit),
    query.model.countDocuments(query.getFilter()),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      hasNextPage: page * limit < totalDocs,
      hasPrevPage: page > 1,
    },
  };
};

export default paginate;
