export function buildPagination(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);

  const limit = Math.min(
    Math.max(parseInt(query.limit) || 10, 1),
    100
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: query.sort || '-createdAt',
    search: query.search?.trim() || ''
  };
}

export function buildPaginationResponse(
  page,
  limit,
  total,
  data
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
    data
  };
}