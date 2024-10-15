export const hasValue = (obj) => {
  return Boolean(obj) && (obj !== "null" || obj !== "undefined");
};
