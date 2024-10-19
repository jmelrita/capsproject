"use client";

import React from "react";

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center">
      <div className="font-sans text-center text-[#382B25]">
        <div className="font-bold text-4xl pb-4">Contact Us</div>
        <div className="text-base">
          <span>
            Questions, bug reports, feedback, feature requests - we&apos;re here
            for it all.
          </span>
        </div>
        <div>
          <span>
            Already use Pa-healot?{" "}
            <a href="" className="font-bold text-[#382B25]">
              Sign in
            </a>{" "}
            so we can tailor your support experience. If that&apos;s not
            possible, we&apos;d still like to hear from you.
          </span>
        </div>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-[#382B25] bg-[#E2D9D2] border-[#382B25] border-1 p-4 rounded-2xl">
        <div>
          <div className="flex py-1">
            <div className="font-semibold">
              <label>First name*</label>
              <input
                className="block w-full rounded-md border-0 py-1.5 pe-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#382B25] sm:text-sm sm:leading-6 "
                type="text"
                name="fname"
              ></input>
            </div>
            <div className="font-semibold">
              <label>Last name</label>
              <input
                className="block w-full rounded-md border-0 py-1.5 pe-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#382B25] sm:text-sm sm:leading-6"
                type="text"
                name="fname"
              ></input>
            </div>
          </div>
          <div className="py-1">
            <label className="font-semibold">Email*</label>
            <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#382B25] sm:text-sm sm:leading-6"
              type="email"
              name="email"
            ></input>
          </div>
          <div className="py-1 pb-3">
            <label className="font-semibold">What can we help you with?</label>
            <textarea
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#382B25] sm:text-sm sm:leading-6"
              type="text"
              name="fname"
            ></textarea>
          </div>
          <div className="">
            <button
              className="bg-[#382B25] text-white p-2 rounded-2xl font-semibold"
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
