/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="w-full px-4 lg:mx-24 py-12">
      <div className="max-w-5xl  mb-8 lg:mb-16">
        <h1 className="text-white text-3xl font-bold">Create a new movie</h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:gap-24 place-items-start"
      >
        <div className="flex flex-col pb-12  w-full">
          <label
            className="
              w-full h-64 md:h-96 border-2 border-dashed border-white 
              rounded-md flex items-center justify-center
            "
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-white">Upload an image here</span>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {errors.image && (
            <p className="text-[#eb5758] mt-2">{errors.image.message}</p>
          )}
        </div>

        <div className="flex flex-col w-full">
          <input
            {...register("title")}
            placeholder="Title"
            className="bg-[#224957] text-white px-4 py-2 rounded-lg w-3/4 mb-4"
          />
          {errors.title && (
            <p className="text-[#eb5758] mb-2">{errors.title.message}</p>
          )}

          <div className="md:w-2/5 lg:mb-8">
            <input
              {...register("publishingYear")}
              placeholder="Publishing year"
              className="bg-[#224957] text-white px-4 py-2 rounded-lg w-full mb-4"
            />
            {errors.publishingYear && (
              <p className="text-[#eb5758] mb-2">
                {errors.publishingYear.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 w-full">
            <Link href="/">
              <button
                type="button"
                className="border border-white text-white px-12 py-3 rounded-md"
              >
                <span className="font-bold">Cancel</span>
              </button>
            </Link>
            <button
              type="submit"
              className="bg-[#2AD17E] text-white px-12 py-3 rounded-md"
            >
              <span className="font-bold">
                {" "}
                {loading ? "Submitting..." : "Submit"}
              </span>
            </button>
          </div>

          {error && <p className="text-[#eb5758] mt-4">{error.message}</p>}
        </div>
      </form>
    </div>
  );
}
