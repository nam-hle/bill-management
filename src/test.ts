import { API } from "@/api";

console.log(API.Bills.List.SearchParamsSchema.safeParse({ page: 1 }));
console.log(API.Bills.List.SearchParamsSchema.safeParse({ page: "2" }));
