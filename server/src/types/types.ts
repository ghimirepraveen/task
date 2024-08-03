import { Prisma } from "@prisma/client";
declare global {
  namespace Express {
    export interface Users extends Prisma.UserFieldRefs {}
    export interface Post extends Prisma.PostFieldRefs {}
    export interface Img extends Prisma.imgFieldRefs {}
  }
}
