/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, gql } from "@apollo/client";

// Define a test query (adjust the query to match your AppSync schema)

export const LIST_MOVIES = gql`
  query ListMovies {
    listMovies {
      id
      title
      publishingYear
      poster
    }
  }
`;

export default function TestPage() {
  const { loading, error, data } = useQuery(LIST_MOVIES);

  if (loading) return <p className="text-white">Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  console.log(data);
  return (
    <div className="p-4">
      <h1 className="text-white text-2xl font-bold mb-4">Movie List</h1>
      {data.listMovies.length === 0 ? (
        <p className="text-white">No movies found.</p>
      ) : (
        <ul>
          {data.listMovies.map((movie: any) => (
            <li key={movie.id} className="text-white">
              {movie.title} {movie.publishingYear}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
