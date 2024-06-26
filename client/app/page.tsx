"use client";

const BadWordsNext = require("bad-words-next");

const en = require("bad-words-next/data/en.json");
const es = require("bad-words-next/data/es.json");
const fr = require("bad-words-next/data/fr.json");
const de = require("bad-words-next/data/de.json");
const ru = require("bad-words-next/data/ru.json");
const rl = require("bad-words-next/data/ru_lat.json");
const ua = require("bad-words-next/data/ua.json");
const pl = require("bad-words-next/data/pl.json");
const ch = require("bad-words-next/data/ch.json");

const badwords = new BadWordsNext();
badwords.add(en);
badwords.add(es);
badwords.add(fr);
badwords.add(de);
badwords.add(ru);
badwords.add(rl);
badwords.add(ua);
badwords.add(pl);
badwords.add(ch);

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { FiTrash } from "react-icons/fi";

export default function Home() {
  type FormData = {
    nameOfDetail: string;
    detail: string;
  };

  interface User {
    _id: string;
    nameOfDetail: string;
    detail: string;
  }
  const fetchdata = async () => {
    setUsers([]);
    fetch("https://random-details.onrender.com/api/getall")
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUsers(result);
      })
      .catch((error) => console.log("error", error));
  };

  // Update the state type
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        "https://random-details.onrender.com/api/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameOfDetail: badwords.filter(data.nameOfDetail),
            detail: badwords.filter(data.detail),
          }),
        }
      );

      if (response.ok) {
        toast.success("Data submitted successfully");
        fetchdata();
        data.detail = "";
        data.nameOfDetail = "";
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the data");
    }
  };

  async function onDelete(id: string) {
    try {
      const response = await fetch(
        `https://random-details.onrender.com/api/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      // Throw error if status is 4xx or 5xx
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Success
      toast.success("Deleted successfully");
      fetchdata();
    } catch (error: any) {
      // Catch network errors
      if (error.message.includes("Failed to fetch")) {
        toast.error("Network error - please try again");

        // Catch server response errors
      } else {
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="bg-slate-800  flex flex-col md:block   items-center w-screen pl-10 text-white -mt-[2.5rem]">
      <div>
        <Toaster />
      </div>
      <h1 className="text-center text-2xl font-semibold  pt-20 mb-24 ">
        {" "}
        Put Your Random Details
      </h1>
      <form
        className="flex flex-col md:flex-row gap-x-8 md:justify-center gap-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex  md:flex-col gap-y-5">
          <input
            type="text"
            placeholder="Name of Detail"
            {...register("nameOfDetail", { required: true, minLength: 2 })}
            className="p-2 rounded-md text-black placeholder:text-lg placeholder:font-medium border-2 border-black w-72"
          />
          {errors.nameOfDetail && (
            <span className="text-red-700 text-xl font-medium">
              This field is required
            </span>
          )}
        </div>
        <div className="flex flex-col gap-y-5">
          <input
            type="text"
            placeholder="Detail"
            {...register("detail", { required: true, minLength: 2 })}
            className="p-2 rounded-md w-72 text-black placeholder:text-lg placeholder:font-medium border-2 border-black"
          />
          {errors.detail && (
            <span className="text-red-700 text-xl font-medium">
              This field is required
            </span>
          )}
        </div>
        <button className="bg-gray-600 border-2 border-gray-900 rounded-md w-72 self-center  pt-2 pb-2 pl-1 pr-1">
          Submit
        </button>
      </form>

      <DisplayData />
    </div>
  );
  function DisplayData() {
    return (
      <div className="relative p-4 text-left">
        <button
          className="text-blue-600 bg-slate-100 absolute  p-5 rounded-full shadow-xl top-20 right-20 "
          onClick={fetchdata}
        >
          ↺
        </button>
        <h2>
          {users.length}{" "}
          {users.length <= 1 ? "Random Detail made" : "Random Details made"}{" "}
        </h2>
        {users != null && users.length > 0 && (
          <div>
            {users.map((user) => (
              <div
                key={user._id}
                className="flex text-left  w-screen flex-row gap-x-6"
              >
                <p className=" text-lg mt-6 relative text-right  w-40 font-semibold">
                  <Image
                    src="/avatar.jpeg"
                    alt="random avatar"
                    className="rounded-full "
                    width={40}
                    height={40}
                  />
                  <span className=" absolute right-0 top-1 ">Random User </span>
                  <br />
                  {user.nameOfDetail} : {user.detail}
                  <FiTrash
                    onClick={() => {
                      onDelete(user._id);
                    }}
                  />
                </p>

                <hr />
              </div>
            ))}
          </div>
        )}
        {users === null || (users.length === 0 && <span></span>)}
      </div>
    );
  }
}
