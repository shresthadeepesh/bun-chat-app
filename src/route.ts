import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite", { create: true });

export async function home() {
  const result = await fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((res) => res);

  const data = {
    message: "Success",
    data: result,
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "applicatiobn/json",
    },
  });
}

export async function asyncHome(req: Request) {
  const result = await Promise.allSettled([
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => res.json())
      .then((res) => res),
    fetch("https://jsonplaceholder.typicode.com/posts/2")
      .then((res) => res.json())
      .then((res) => res),
    fetch("https://jsonplaceholder.typicode.com/posts/3")
      .then((res) => res.json())
      .then((res) => res),
  ]);

  const failed = result.filter((el) => el.status === "rejected");

  if (failed.length > 0) {
    return new Response(
      JSON.stringify({
        message: "Failed to call some api.",
      }),
      {
        headers: {
          "Content-Type": "applicatiobn/json",
        },
      }
    );
  }

  const data = {
    message: "Success",
    data: result.map((el) => el.value),
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "applicatiobn/json",
    },
  });
}

export async function createPost() {
  const query = db.query("create table posts");
  query.run();

  return new Response(
    JSON.stringify({
      message: "DB and table has been created.",
    }),
    {
      headers: {
        "Content-Type": "applicatiobn/json",
      },
    }
  );

  //   const query = db.query("");
}

export async function posts() {}
