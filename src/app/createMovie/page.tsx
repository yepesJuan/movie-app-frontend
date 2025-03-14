"use client";

import { useMutation } from "@apollo/client";
import { CREATE_MOVIE } from "@/graphql/queries";
import { uploadImageToS3 } from "@/lib/uploadImage";
import MovieForm from "@/app/components/MovieForm";
import { CreateMovieResponse, CreateMovieVariables } from "@/graphql/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formTextObj = {
  title: "Create a new movie",
  button: "Submit",
  alert: "Created successfully!",
};

export default function CreateMoviePage() {
  const [createMovie, { loading }] = useMutation<
    CreateMovieResponse,
    CreateMovieVariables
  >(CREATE_MOVIE);

  const router = useRouter();

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );

  const handleCreate = async (formData: {
    title: string;
    publishingYear: string;
    poster?: File;
  }) => {
    if (loading) return;
    try {
      const posterUrl = await uploadImageToS3(formData.poster!);

      const { data } = await createMovie({
        variables: {
          title: formData.title,
          publishingYear: parseInt(formData.publishingYear, 10),
          poster: posterUrl,
        },
        refetchQueries: ["ListMovies"],
      });
      if (!data?.createMovie) {
        throw new Error("Failed to update movie.");
      }

      setStatusMessage(formTextObj.alert);
      setStatusType("success");

      setTimeout(() => {
        router.push("/");
      }, 1600);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setStatusMessage(error.message);
      setStatusType("error");

      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 1500);
    }
  };

  return (
    <MovieForm
      formText={formTextObj}
      onSubmit={handleCreate}
      loading={loading}
      statusMessage={statusMessage}
      statusType={statusType}
    />
  );
}
