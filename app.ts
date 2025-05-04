import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
// app.use(todoRoutes);
// /* express global error handler (middleware) */
// app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
//   res.status(500).json({ message: `An error occurred! \n ${error}` });
// });

app.get("/", (req, res) => {
  console.log(req.method);

  res.json({ message: "Halo Word!" });
});

app.listen(3030);

// console.log("Prisma:", prisma);
async function main() {
  // const allUsers = await prisma["student-test"].findMany();
  // Run inside `async` function
  const user = await prisma.user.create({
    data: {
      name: "Max",
      email: "max@prisma.io",
      posts: {
        create: { title: "Join us for Prisma Day 2020" },
      },
    },
  });
  // console.log("prisma?", prisma);
}

main()
  .then(async () => {
    // await prisma.$disconnect();
    console.log("User was created!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
