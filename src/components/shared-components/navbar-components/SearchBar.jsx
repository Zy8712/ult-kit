"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center border-gray-400 border-2 border-solid w-full max-w-[520px] h-11 rounded-full overflow-hidden">
      <Image
        src={"/icons/navbar-icons/search-folder-svgrepo-com.svg"}
        alt=""
        height={28}
        width={28}
        className="absolute left-5 top-1/2 -translate-y-1/2 opacity-70"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search library for tools........"
        className="pt-[2px] w-full h-full font-semibold text-white text-lg leading-none placeholder:text-lg font-theme-oxanium bg-transparent focus:bg-white focus:bg-opacity-15 rounded-full ps-16 pe-20 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-20 h-11 grid place-items-center border-gray-400 border-solid border-2 rounded-full bg-black hover:bg-gradient-to-tr from-purple-500 to-blue-500"
      >
        <Image
          src={"/icons/navbar-icons/search-svgrepo-com.svg"}
          alt=""
          height={20}
          width={20}
        />
      </button>
    </div>
  );
}
