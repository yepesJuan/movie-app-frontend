"use client";

import { useMutation } from "@apollo/client";
import { uploadImageToS3 } from "@/lib/uploadImage";
import { useRouter, useParams } from "next/navigation";
import MovieForm from "@/app/components/MovieForm";
import { UPDATE_MOVIE } from "@/graphql/queries";
import { UpdateMovieResponse, UpdateMovieVariables } from "@/graphql/types";
import { useState } from "react";

const formTextObj = {
  title: "Edit",
  button: "Update",
  alert: "Updated successfully!",
};

export default function EditMoviePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [updateMovie, { loading: updating }] = useMutation<
    UpdateMovieResponse,
    UpdateMovieVariables
  >(UPDATE_MOVIE);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );

  const handleUpdate = async (formData: {
    title: string;
    publishingYear: string;
    poster?: File;
  }) => {
    if (updating) return;
    try {
      const posterUrl = await uploadImageToS3(formData.poster!);

      const { data } = await updateMovie({
        variables: {
          id,
          title: formData.title,
          publishingYear: parseInt(formData.publishingYear, 10),
          poster: posterUrl,
        },
        refetchQueries: ["ListMovies"],
      });

      if (!data?.updateMovie) {
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
      onSubmit={handleUpdate}
      loading={updating}
      statusMessage={statusMessage}
      statusType={statusType}
    />
  );
}
