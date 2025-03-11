"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { LIST_MOVIES } from "@/graphql/queries";
import { ListMoviesData, Movie } from "@/graphql/types";
import { useAuthenticator } from "@aws-amplify/ui-react";
import SignOutButton from "@/app/components/SignOut";
import { CiCirclePlus } from "react-icons/ci";
import { useMediaQuery } from "react-responsive";

export default function Dashboard() {
  const { user, route } = useAuthenticator();
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const itemsPerPage = isLargeScreen ? 8 : 6;

  // Cache pages data
  const [pagesData, setPagesData] = useState<{
    [page: number]: { movies: Movie[]; nextToken: string | null };
  }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  // Initial query for page 1
  const { data, loading, error, fetchMore } = useQuery<ListMoviesData>(
    LIST_MOVIES,
    {
      skip: route !== "authenticated",
      fetchPolicy: "cache-and-network",
      variables: {
        limit: itemsPerPage,
        nextToken: null,
      },
    }
  );

  // Cache page 1 data
  useEffect(() => {
    if (!data) return;
    setPagesData((prevPages) => {
      if (!prevPages[1]) {
        return {
          ...prevPages,
          1: {
            movies: data.listMovies.items || [],
            nextToken: data.listMovies.nextToken || null,
          },
        };
      }
      return prevPages;
    });
  }, [data]);

  // for subsequent fetches  (main fetch + peek query)  issues from getting a nextToken....
  const fetchPage = async (pageNumber: number, token: string | null) => {
    setIsLoadingPage(true);
    try {
      // Main fetch: fetch exactly itemsPerPage movies
      const mainResult = await fetchMore({
        variables: { limit: itemsPerPage, nextToken: token },
      });
      const mainItems: Movie[] = mainResult.data?.listMovies.items || [];
      let mainNextToken: string | null =
        mainResult.data?.listMovies.nextToken || null;

      // If full page and a nextToken, peek to see if data exists
      if (mainItems.length === itemsPerPage && mainNextToken) {
        const peekResult = await fetchMore({
          variables: { limit: itemsPerPage, nextToken: mainNextToken },
        });
        const peekItems = peekResult.data?.listMovies.items || [];
        if (peekItems.length === 0) {
          mainNextToken = null;
        }
      }

      // Cache the fetched page
      setPagesData((prev) => ({
        ...prev,
        [pageNumber]: { movies: mainItems, nextToken: mainNextToken },
      }));
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error("Error fetching page:", err);
    } finally {
      setIsLoadingPage(false);
    }
  };

  // Helperr to load an arbitrary page (from cache or by fetching)
  const loadPage = async (pageNumber: number) => {
    if (pagesData[pageNumber]) {
      setCurrentPage(pageNumber);
      return;
    }

    if (pageNumber > currentPage) {
      const token = pagesData[currentPage]?.nextToken;
      if (!token) return;
      await fetchPage(pageNumber, token);
    } else {
      // Going backwards: use token from previous page if ther
      const token = pagesData[pageNumber - 1]?.nextToken || null;
      await fetchPage(pageNumber, token);
    }
  };

  const goToNextPage = () => loadPage(currentPage + 1);
  const goToPrevPage = () => loadPage(currentPage - 1);

  // Current page data
  const pageData = pagesData[currentPage] || { movies: [], nextToken: null };
  const currentMovies = pageData.movies;
  const hasNextPage = !!pageData.nextToken;
  const hasPrevPage = currentPage > 1;
  const isEmpty =
    !loading &&
    !isLoadingPage &&
    data &&
    currentMovies.length === 0 &&
    currentPage === 1;

  if ((loading && !data) || (isLoadingPage && currentMovies.length === 0)) {
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

  return (
    <div className="relative w-full h-full text-white bg-[#093545]">
      {isEmpty ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.signInDetails?.loginId || "User"}!
          </h2>
          <h1 className="text-4xl font-bold mb-6 text-center">
            Your movie list is empty
          </h1>
          <Link
            href="/createMovie"
            className="px-8 py-3 bg-[#2AD17E] text-white rounded-lg hover:bg-[#22B06C] transition-colors text-center font-bold"
          >
            <span className="font-bold">Add a new movie</span>
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pt-12 ">
          <div className="flex items-center justify-between mb-12 w-full max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold">My movies</h1>
              <Link href="/createMovie">
                <button className="flex items-center space-x-1 text-white rounded-full mt-1 hover:text-[#2AD17E] transition-colors">
                  <CiCirclePlus className="text-2xl" />
                </button>
              </Link>
            </div>
            <SignOutButton />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-4 place-items-center">
            {currentMovies.map((movie) => (
              <Link
                key={movie.id}
                href={`/editMovie/${movie.id}`} // Assuming this is your route
                className="w-40 md:w-50 lg:w-60 h-64 md:h-70 lg:h-80"
              >
                <div
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
              </Link>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
            <button
              onClick={goToPrevPage}
              disabled={!hasPrevPage || isLoadingPage}
              className={`${
                hasPrevPage && !isLoadingPage
                  ? "text-white hover:bg-gray-600 transition-colors"
                  : "text-gray-500 cursor-not-allowed"
              } px-4 py-2 rounded`}
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
              disabled={!hasNextPage || isLoadingPage}
              className={`${
                hasNextPage && !isLoadingPage
                  ? "text-white hover:bg-gray-600 transition-colors"
                  : "text-gray-500 cursor-not-allowed"
              } px-4 py-2 rounded`}
            >
              <span className="font-bold">Next</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
