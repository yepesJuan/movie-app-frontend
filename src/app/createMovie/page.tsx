"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { CREATE_MOVIE } from "@/graphql/queries";
import { uploadImageToS3 } from "@/lib/uploadImage";
import { CreateMovieData, CreateMovieArgs } from "@/graphql/types";

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publishingYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year (e.g., 2023)"),
  image: z.instanceof(File, { message: "Image is required" }),
});

export default function CreateMoviePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(movieSchema),
  });

  const [createMovie, { loading, error }] = useMutation<
    CreateMovieData,
    CreateMovieArgs
  >(CREATE_MOVIE);

  const [preview, setPreview] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const posterUrl = await uploadImageToS3(data.image);

      await createMovie({
        variables: {
          title: data.title,
          publishingYear: parseInt(data.publishingYear, 10),
          poster: posterUrl,
        },
      });

      alert("Movie added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add movie.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#093545]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6 bg-[#093545] p-8 rounded-lg"
      >
        <h1 className="text-white text-2xl font-bold">Create a new movie</h1>

        <label className="w-64 h-64 border-2 border-dashed border-white flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white">Drop an image here</span>
          )}
          <input type="file" className="hidden" onChange={handleImageChange} />
        </label>
        {errors.image && (
          <p className="text-[#eb5758]">{errors.image.message}</p>
        )}

        <input
          {...register("title")}
          placeholder="Title"
          className="bg-[#224957] text-white px-4 py-2 rounded-md w-80"
        />
        {errors.title && (
          <p className="text-[#eb5758]">{errors.title.message}</p>
        )}

        <input
          {...register("publishingYear")}
          placeholder="Publishing year"
          className="bg-[#224957] text-white px-4 py-2 rounded-md w-80"
        />
        {errors.publishingYear && (
          <p className="text-[#eb5758]">{errors.publishingYear.message}</p>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            className="border border-white text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#2AD17E] text-white px-6 py-2 rounded-md"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

        {error && <p className="text-[#eb5758]">{error.message}</p>}
      </form>
    </div>
  );
}
