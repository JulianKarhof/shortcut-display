import type { NextPage } from "next";
import Head from "next/head";
import CategoryCard from "../components/categoryCard";
import shortcutList from "../shortcuts.json";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import { titleCase } from "../helpers/titleCase";

interface Namespace {
  title: string;
  list: Shortcut[];
}

interface Shortcut {
  title: string;
  shortcut: string;
  category?: string;
}

const Home: NextPage = () => {
  const [shortcuts, setShortcuts] = useState<Namespace[]>(shortcutList);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setShortcuts(shortcutList);
  }, []);

  const filteredShortcuts =
    query === ""
      ? shortcuts
      : shortcuts.map((result) => ({
          title: result.title,
          list: new Fuse(result.list, {
            keys: ["title", "category", "aliases"],
            threshold: 0.4,
            findAllMatches: true,
          })
            .search(query)
            .map((result) => result.item),
        }));

  const getCatergoriesForNamespace = (namespace?: Namespace) => {
    const categories = namespace?.list?.map((shortcut) => shortcut.category);
    return [...new Set(categories)];
  };

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("searchInput")?.focus();
      }
    });
  });

  return (
    <div className="flex flex-col justify-between min-h-screen bg-slate-50">
      <Head>
        <title>Shortcuts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-center items-center">
        <div style={{ maxWidth: 600 }}>
          <div className="text-center mt-10">
            <p className="text-3xl font-extrabold">Shortcuts</p>
          </div>

          <div className="pt-2 relative text-gray-600 mt-4 flex">
            <input
              id="searchInput"
              className="border-2 border-gray-300 bg-white h-12 px-5 rounded-md focus:outline-none w-full text-lg focus:border-gray-400 focus:shadow-lg transition-shadow"
              placeholder="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="border-2 ml-2 px-4 rounded-md bg-blue-200 border-blue-300 hover:shadow-lg transition-shadow">
              Edit
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {filteredShortcuts.map(
            (namespace) =>
              namespace.list.length > 0 && (
                <div key={namespace.title ?? "general"}>
                  <div
                    className="mt-4 bg-slate-300 p-4 border-2 rounded-md pb-0 mr-2"
                    style={{ maxWidth: 600, minWidth: 600 }}
                  >
                    <div className="text-xl font-bold text-center mb-4">
                      {titleCase(namespace.title) ?? "General"}
                    </div>
                    <div
                      className="flex flex-col justify-center"
                      style={{ minWidth: 500 }}
                    >
                      {getCatergoriesForNamespace(namespace).map(
                        (category) =>
                          filteredShortcuts.length > 0 && (
                            <div className="mb-4" key={category ?? "general"}>
                              <CategoryCard
                                shortcuts={namespace.list.filter(
                                  (shortcut) => shortcut.category === category
                                )}
                              />
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      <footer className="flex justify-center p-10 ">
        <a
          href="https://giphy.com/gifs/stupid-smart-l44QzsOLXxcrigdgI/fullscreen"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by my 🧠
        </a>
      </footer>
    </div>
  );
};

export default Home;
