export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc: any, key: string) => acc?.[key], obj);
};

// Gets a nested value from an object using a "a.b.c" (dot-separated path) style path.