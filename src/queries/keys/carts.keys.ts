import { createQueryKeyFactory } from "../queryKeyFactory"

const cartsKeys = createQueryKeyFactory("carts")

export const carts = {
  all: cartsKeys.all(),
} as const
