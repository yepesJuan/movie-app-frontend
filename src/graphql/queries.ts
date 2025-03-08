import { gql } from "@apollo/client";

export const LIST_MOVIES = gql`
  query ListMovies($limit: Int, $nextToken: String) {
    listMovies(limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        publishingYear
        poster
      }
      nextToken
    }
  }
`;

export const CREATE_MOVIE = gql`
  mutation CreateMovie(
    $title: String!
    $publishingYear: Int!
    $poster: String
  ) {
    createMovie(
      title: $title
      publishingYear: $publishingYear
      poster: $poster
    ) {
      id
      title
      publishingYear
      poster
    }
  }
`;
