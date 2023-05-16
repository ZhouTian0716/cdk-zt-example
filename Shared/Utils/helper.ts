
export const jsonParser = (input: string | object) => {
  return typeof input === "string" ? JSON.parse(input) : input
}
