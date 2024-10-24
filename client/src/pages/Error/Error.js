import React from "react";
import { Link } from 'react-router-dom';
import { TypeAnimation } from "react-type-animation";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <TypeAnimation
        className="text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600"
        sequence={["404", 1000, "OOPS, WE CAN'T FIND YOUR PAGE!", 1000, "SOMETHING WRONG", 1000, "PLEASE COMEBACK TO HOME PAGE", 1000]}
        wrapper="span"
        speed={50}
        style={{ fontSize: "3rem", display: "block" }}
        repeat={Infinity}
      />
      <Link
        to="/"
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500"
      >
        Home
      </Link>
    </div>
  );
}
