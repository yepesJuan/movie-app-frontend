"use client";

import { useQuery } from "@apollo/client";
import { LIST_MOVIES } from "@/graphql/queries";
import { useAuthenticator } from "@aws-amplify/ui-react";
import SignOutButton from "@/app/components/SignOut";
import { CiCirclePlus } from "react-icons/ci";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";
import { useState, useEffect, useRef } from "react";
import { ListMoviesData } from "@/graphql/types";

export default function Dashboard() {
  const { user, route } = useAuthenticator();
  const limit = useResponsiveLimit();
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenMap, setTokenMap] = useState<{ [key: number]: string | null }>({
    1: null, // First page starts with null token
  });
  const [isPageChanging, setIsPageChanging] = useState(false);
  const isFirstRender = useRef(true);

  // Get the nextToken for the current page from our map
  const currentToken = tokenMap[currentPage];

  const { loading, error, data } = useQuery<ListMoviesData>(LIST_MOVIES, {
    skip: route !== "authenticated",
    fetchPolicy: "cache-and-network",
    variables: { limit, nextToken: currentToken },
  });

  // Only update tokenMap when data changes, but not on first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only update if we have data and a nextToken
    const nextToken = data?.listMovies.nextToken;
    if (nextToken !== undefined) {
      setTokenMap((prevMap) => ({
        ...prevMap,
        // TypeScript now knows nextToken is string | null, not undefined
        [currentPage + 1]: nextToken,
      }));
    }

    setIsPageChanging(false);
  }, [data?.listMovies.nextToken, currentPage]);

  const goToNextPage = () => {
    if (!data?.listMovies.nextToken) return;

    setIsPageChanging(true);
    setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage <= 1) return;

    setIsPageChanging(true);
    setCurrentPage((prev) => prev - 1);
  };

  if (loading && !isPageChanging) {
    return (
      <div className="flex-1 flex items-center justify-center text-white h-screen bg-[#093545]">
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 h-screen bg-[#093545]">
        Error: {error.message}
      </div>
    );
  }

  const movies = data?.listMovies.items || [];
  const hasNextPage = !!data?.listMovies.nextToken;
  const hasPreviousPage = currentPage > 1;
  const isEmpty = movies.length === 0;

  return (
    <div className="relative w-full h-full text-white bg-[#093545]">
      {isEmpty ? (
        /* Empty State */
        <div className="min-h-screen  flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.signInDetails?.loginId || "User"}!
          </h2>
          <h1 className="text-4xl font-bold mb-6 text-center">
            Your movie list is empty
          </h1>
          <button className="px-8 py-3 bg-[#2AD17E] text-white rounded-lg hover:bg-[#22B06C] transition-colors">
            <span className="font-bold">Add a new movie</span>
          </button>
        </div>
      ) : (
        /* Movie List */
        <div className="max-w-7xl mx-auto px-4 pt-16">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-12 w-full max-w-7xl mx-auto px-4">
            {/* Left side: My movies + Add Movie button */}
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold">My movies</h1>
              <button className="flex items-center space-x-1 text-white rounded-full mt-1 hover:text-[#2AD17E] transition-colors">
                <CiCirclePlus className="text-2xl" />
              </button>
            </div>
            {/* Right side: Sign Out button */}
            <SignOutButton />
          </div>

          {/* Movies grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 place-items-center">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-[#092C39] rounded-lg shadow cursor-pointer w-40 md:w-50 lg:w-60 
                   h-64 md:h-70 lg:h-80 flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="w-full h-full overflow-hidden p-2">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).onerror = null;
                        e.currentTarget.src = "./test.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0F3D54] flex items-center justify-center rounded-lg">
                      No Poster
                    </div>
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-base">{movie.title}</h3>
                  {movie.publishingYear && (
                    <p className="text-sm text-gray-300">
                      {movie.publishingYear}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={goToPrevPage}
              disabled={!hasPreviousPage || isPageChanging}
              className={`${
                hasPreviousPage && !isPageChanging
                  ? "text-white  hover:bg-gray-600 transition-colors"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="font-bold">Prev</span>
            </button>

            <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#2AD17E] text-white font-medium">
              {currentPage}
            </span>
            {hasNextPage && (
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#092C39] text-white font-medium">
                {currentPage + 1}
              </span>
            )}

            <button
              onClick={goToNextPage}
              disabled={!hasNextPage || isPageChanging}
              className={`${
                hasNextPage && !isPageChanging
                  ? " text-white hover:bg-gray-600 transition-colors"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="font-bold">Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
