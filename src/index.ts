import { asyncHome, createPost, home } from "./route";

console.log("App running at port 8080.");

Bun.serve({
  port: 8080,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return home();
    }

    switch (url.pathname) {
      case "/":
        return home();
      case "/db":
        return asyncHome(req);
    }

    return new Response(
      JSON.stringify({
        message: "Not Found",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
});
