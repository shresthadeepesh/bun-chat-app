import db from "./db";

const headers = {
  "Content-Type": "application/json",
};

export async function home() {
  const result = await fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((res) => res);

  const data = {
    message: "Success",
    data: result,
  };

  return new Response(JSON.stringify(data), {
    headers,
  });
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export async function asyncHome(req: Request) {
  const result = await Promise.allSettled<[Post, Post, Post]>([
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
        headers,
      }
    );
  }

  const data = {
    message: "Success",
    data: result.map((el) => el?.value),
  };

  return new Response(JSON.stringify(data), {
    headers,
  });
}

export async function createPostTable() {
  const query = db.query(
    "create table posts(id int auto_increment primary key, title varchar(255), body text, createdAt datetime, updatedAt datetime)"
  );
  query.run();

  return new Response(
    JSON.stringify({
      message: "DB and table has been created.",
    }),
    {
      headers,
    }
  );

  //   const query = db.query("");
}
