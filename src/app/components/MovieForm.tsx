"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineFileDownload } from "react-icons/md";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { FormTextConfig } from "@/graphql/types";

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publishingYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year (e.g., 2023)"),
  poster: z.instanceof(File, { message: "Poster is required" }),
});

type MovieFormData = z.infer<typeof movieSchema>;

type MovieFormProps = {
  formText: FormTextConfig;
  onSubmit: (data: MovieFormData) => void;
  loading: boolean;
  statusMessage?: string | null;
  statusType?: "success" | "error" | null;
};

export default function MovieForm({
  onSubmit,
  loading,
  formText,
  statusMessage,
  statusType,
}: MovieFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("poster", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const isLargeScreen = useMediaQuery({ minWidth: 1024 });

  return (
    <div className="w-full px-4 md:mx-16 lg:mx-24 py-16">
      <div className="max-w-5xl mb-12 lg:mb-16">
        <h1 className="text-white text-3xl font-bold">{formText.title}</h1>
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
                onChange={handlePosterChange}
              />
            </label>
            {errors.poster && (
              <p className="text-[#eb5758] mt-2">{errors.poster.message}</p>
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
                  disabled={loading}
                  className="w-full bg-[#2AD17E] text-white px-4 py-3 rounded-md appearance-none focus:outline-none box-border"
                >
                  <span className="font-bold">
                    {loading ? "Submitting..." : formText.button}
                  </span>
                </button>
              </div>
            </div>
            {/* {error && <p className="text-[#eb5758] mt-4">{error.message}</p>} */}
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
                onChange={handlePosterChange}
              />
            </label>
            {errors.poster && (
              <p className="text-[#eb5758] mt-2">{errors.poster.message}</p>
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
                disabled={loading}
                className="w-full bg-[#2AD17E] text-white px-4 py-3 rounded-md appearance-none focus:outline-none box-border"
              >
                <span className="font-bold">
                  {loading ? "Submitting..." : "Submit"}
                </span>
              </button>
            </div>
          </div>

          {/* {error && <p className="text-[#eb5758] mt-4">{error.message}</p>} */}
        </form>
      )}
      {statusMessage && (
        <div
          className={`fixed left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-white font-bold z-50 ${
            statusType === "success" ? "bg-[#2AD17E]" : "bg-[#eb5758]"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
