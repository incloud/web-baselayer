import { isProduction } from './environment';

interface IQueryParameters {
  [key: string]: string;
}

/**
 * @param path Starts with a slash
 * @param queryParameters Object containing query parameters as key-value-pairs
 */
export function createLink(
  path: string = '/',
  queryParameters: IQueryParameters,
) {
  const queryString = Object.keys(queryParameters)
    .map(
      key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          queryParameters[key],
        )}`,
    )
    .join('&');

  return `http${isProduction() ? 's' : ''}://${process.env.HOST}${path}${
    queryString.length > 0 ? `?${queryString}` : ''
  }`;
}
