import React, { useEffect, useState } from "react";

const SearchFilter = ({ onChange, placeholder }) => {
  const [query, setQuery] = useState("");
  const searchQuery = useDebounce(query, 400);

  useEffect(() => {
    onChange(searchQuery);
  }, [onChange, searchQuery]);

  return (
    <div className="relative flex items-center justify-end text-lg border-2 text-secondary border-secondary">
      <input
        type="search"
        id="search"
        name="search"
        className="block w-full px-4 py-1 shadow-sm pl-11 text-md focus:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <span className="fa-solid fa-magnifying-glass"></span>
      </div>
    </div>
  );
};

const useDebounce = (value, milliSeconds) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, milliSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
};

export default SearchFilter;
