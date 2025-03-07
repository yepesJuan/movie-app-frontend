import { gql } from "@apollo/client";
import { Movie } from "./types";

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

export interface ListMoviesData {
  listMovies: {
    items: Movie[];
    nextToken?: string | null;
  };
}
