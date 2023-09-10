import db from "../db";

const headers = {
  "Content-Type": "application/json",
};

export class PostController {
  public async create(req: Request) {
    const date = new Date().toDateString();
    const query = db.query(
      "insert into posts(id, title, body, createdAt, updatedAt) values($id, $title, $body, $createdAt, $updatedAt)"
    );
    query.run({
      $id: Math.random() * 100,
      $title: "First date",
      $body: "First date",
      $createdAt: date,
      $updatedAt: date,
    });

    const data = {
      title: req.body,
    };

    return new Response(
      JSON.stringify({
        message: "Post created successfully.",
      }),
      {
        headers,
      }
    );
  }

  public async index() {
    const query = db.query("select * from posts");
    const result = query.all();

    const data = {
      message: "Success",
      data: result,
    };

    return new Response(JSON.stringify(data), {
      headers,
    });
  }

  async show(req: Request) {
    const query = db.query("select * from posts");
    const result = query.all();

    const data = {
      message: "Success",
      data: result,
    };

    return new Response(JSON.stringify(data), {
      headers,
    });
  }
}
