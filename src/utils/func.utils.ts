import { bookCategories } from "./consts.utils.js";

export function isCategorieExist(categorie: string | undefined) {
  const asArrOfStrings = bookCategories as readonly string[];
  return typeof categorie === "string" && asArrOfStrings.includes(categorie);
}
