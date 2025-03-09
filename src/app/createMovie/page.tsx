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
import { useMediaQuery } from "react-responsive";
import { MdOutlineFileDownload } from "react-icons/md";

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

  const isLargeScreen = useMediaQuery({ minWidth: 1024 });

  return (
    <div className="w-full px-4 md:mx-16 lg:mx-24 py-16">
      <div className="max-w-5xl mb-12 lg:mb-16">
        <h1 className="text-white text-3xl font-bold">Create a new movie</h1>
      </div>

      {isLargeScreen ? (
        // Large screens layout: two-column
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-5xl flex flex-row gap-24"
        >
          <div className="w-full">
            <label className="w-full h-120 border-2 border-dashed border-white rounded-md flex items-center justify-center bg-[#224957]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <MdOutlineFileDownload className="text-white text-2xl" />
                    <span className="text-white mt-2">
                      Upload an image here
                    </span>
                  </div>
                </>
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

          <div className="w-full flex flex-col">
            <div>
              <div className="w-full lg:mb-6 mb-4">
                <input
                  {...register("title")}
                  placeholder="Title"
                  className="bg-[#224957] text-white px-4 py-2 rounded-lg w-full lg:w-3/4"
                />
                {errors.title && (
                  <p className="text-[#eb5758] mb-2">{errors.title.message}</p>
                )}
              </div>

              <div className="lg:mb-12 mb-4">
                <input
                  {...register("publishingYear")}
                  placeholder="Publishing year"
                  className="bg-[#224957] text-white px-4 py-2 rounded-lg w-full md:w-3/5 lg:w-1/2"
                />
                {errors.publishingYear && (
                  <p className="text-[#eb5758] mb-2">
                    {errors.publishingYear.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full lg:w-3/4">
              <div className="flex-1">
                <Link href="/">
                  <button
                    type="button"
                    className="w-full border border-white text-white px-4 py-3 rounded-md appearance-none focus:outline-none box-border"
                  >
                    <span className="font-bold">Cancel</span>
                  </button>
                </Link>
              </div>
              <div className="flex-1">
                <button
                  type="submit"
                  className="w-full bg-[#2AD17E] text-white px-4 py-3 rounded-md appearance-none focus:outline-none box-border"
                >
                  <span className="font-bold">
                    {loading ? "Submitting..." : "Submit"}
                  </span>
                </button>
              </div>
            </div>
            {error && <p className="text-[#eb5758] mt-4">{error.message}</p>}
          </div>
        </form>
      ) : (
        // Small screens- vertical stack (inputs, then upload, then buttons)
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-5xl mx-auto grid grid-cols-1 gap-4"
        >
          <div>
            <div className="w-full lg:mb-8 mb-4">
              <input
                {...register("title")}
                placeholder="Title"
                className="bg-[#224957] text-white px-4 py-2 rounded-lg w-full"
              />
              {errors.title && (
                <p className="text-[#eb5758] mb-2">{errors.title.message}</p>
              )}
            </div>

            <div className="lg:mb-8 mb-4">
              <input
                {...register("publishingYear")}
                placeholder="Publishing year"
                className="bg-[#224957] text-white px-4 py-2 rounded-lg w-full"
              />
              {errors.publishingYear && (
                <p className="text-[#eb5758] mb-2">
                  {errors.publishingYear.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col pb-6">
            <label className="w-full h-64 md:h-96 border-2 border-dashed border-white rounded-md flex items-center justify-center bg-[#224956]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <MdOutlineFileDownload className="text-white text-2xl" />
                    <span className="text-white mt-2">
                      Upload an image here
                    </span>
                  </div>
                </>
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

          <div className="flex gap-4 w-full">
            <div className="flex-1">
              <Link href="/">
                <button
                  type="button"
                  className="w-full border border-white text-white px-4 py-3 rounded-md appearance-none focus:outline-none box-border"
                >
                  <span className="font-bold">Cancel</span>
                </button>
              </Link>
            </div>
            <div className="flex-1">
              <button
                type="submit"
                className="w-full bg-[#2AD17E] text-white px-4 py-3 rounded-md appearance-none focus:outline-none box-border"
              >
                <span className="font-bold">
                  {loading ? "Submitting..." : "Submit"}
                </span>
              </button>
            </div>
          </div>

          {error && <p className="text-[#eb5758] mt-4">{error.message}</p>}
        </form>
      )}
    </div>
  );
}
