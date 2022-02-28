export const titleCase = (text: string | undefined): string | undefined => {
  return text
    ?.split(" ")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};
