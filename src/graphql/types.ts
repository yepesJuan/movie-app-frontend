export interface Movie {
  id: string;
  title: string;
  publishingYear: number;
  poster: string;
}

export interface ListMoviesData {
  listMovies: {
    items: Movie[];
    nextToken?: string | null;
  };
}

export interface UpdateMovieVariables {
  id: string;
  title: string;
  publishingYear: number;
  poster: string;
}

export interface UpdateMovieResponse {
  updateMovie: Movie;
}

export interface CreateMovieVariables {
  title: string;
  publishingYear: number;
  poster: string;
}

export interface CreateMovieResponse {
  createMovie: Movie;
}

export interface FormTextConfig {
  title: string;
  button: string;
  alert: string;
}
