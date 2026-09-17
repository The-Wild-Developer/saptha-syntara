"use client";

import { ChevronDown, Search } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

interface Option {
  code: string;
  description: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select Reason",
}: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return (
      options.find((option) => option.code === value)?.description || value
    );
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (option) =>
        option.description.toLowerCase().includes(query) ||
        option.code.toLowerCase().includes(query),
    );
  }, [options, search]);

  const updateMenuPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = 260;
    const openUpward = spaceBelow < menuHeight && rect.top > spaceBelow;

    setMenuStyle({
      position: "fixed",
      left: rect.left,
      width: Math.max(rect.width, 220),
      top: openUpward ? undefined : rect.bottom + 4,
      bottom: openUpward ? window.innerHeight - rect.top + 4 : undefined,
      zIndex: 9999,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleReposition = () => updateMenuPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = containerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full min-w-fit items-center justify-between gap-2 rounded-lg border bg-white p-2 text-left text-black focus:outline-none dark:border-gray-500 dark:bg-boxdark-2 dark:text-white"
      >
        <span
          className={`whitespace-nowrap pr-2 ${selectedLabel ? "" : "text-gray-400 dark:text-gray-500"
            }`}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform dark:text-gray-400 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-boxdark-2"
          >
            <div className="border-b border-gray-200 p-2 dark:border-gray-600">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reason..."
                  className="h-9 w-full rounded-md border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-sm text-black focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <ul className="max-h-52 overflow-y-auto py-1">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("")}
                  className={`flex w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${!value
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {placeholder}
                </button>
              </li>

              {filteredOptions.length ? (
                filteredOptions.map((option) => (
                  <li key={option.code}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.code)}
                      className={`flex w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${value === option.code
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-black dark:text-white"
                        }`}
                      title={option.description}
                    >
                      <span className="truncate">{option.description}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-400">
                  No reasons found
                </li>
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SearchableSelect;
