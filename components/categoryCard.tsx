import React from "react";
import { titleCase } from "../helpers/titleCase";

interface Shortcut {
  title: string;
  shortcut: string;
  category?: string;
}

interface CategoryCardProps {
  shortcuts?: Shortcut[];
}
const replacements = [
  ["shift", "⇧"],
  ["ctrl", "⌃"],
  ["alt", "⌥"],
  ["cmd", "⌘"],
  ["win", "⊞"],
  ["option", "⌥"],
  ["command", "⌘"],
  ["enter", "⏎"],
  ["tab", "⇥"],
  ["backspace", "⌫"],
  ["delete", "⌦"],
  ["esc", "⎋"],
  ["up", "↑"],
  ["down", "↓"],
  ["left", "←"],
  ["right", "→"],
  ["home", "↖"],
  ["end", "↘"],
  ["pageup", "⇞"],
  ["pagedown", "⇟"],
];

// make everything that isn't a + into a <kbd>
const transformShortcut = (shortcut: string) => {
  const withUnicodeKeys = replacements.reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(key, "g"), value);
  }, shortcut);

  const withKBD = withUnicodeKeys
    .replaceAll(" + ", " ")
    .replace(/\S+/g, (word) => `<kbd>${word.toUpperCase()}</kbd>`)
    .replaceAll(" ", " + ");
  return withKBD;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ shortcuts }) => {
  if (shortcuts?.length === 0) return <></>;
  return (
    <div className="p-4 bg-slate-100 border-2 border-slate-200 rounded-md">
      <div className="text-xl font-semibold mb-2">
        {titleCase(shortcuts?.[0]?.category) ?? "General"}
      </div>
      {shortcuts?.map((shortcut, i) => (
        <div
          key={shortcut.title}
          className={`flex justify-between py-1 px-2 rounded-md ${
            i % 2 === 0 && "bg-slate-200"
          }`}
        >
          <div className="mr-2">{shortcut.title}</div>
          <div
            dangerouslySetInnerHTML={{
              __html: transformShortcut(shortcut.shortcut),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
