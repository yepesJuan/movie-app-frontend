export interface Movie {
  id: string;
  title: string;
  publishingYear?: number | null;
  poster?: string | null;
}

export interface ListMoviesData {
  listMovies: {
    items: Movie[];
    nextToken?: string | null;
  };
}

export interface CreateMovieData {
  createMovie: Movie;
}
export interface CreateMovieArgs {
  title: string;
  publishingYear: number;
  poster?: string | null;
}
