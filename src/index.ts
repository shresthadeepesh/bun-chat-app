import { ServerWebSocket } from "bun";
import { PostController } from "./controller/post.controller";
import { asyncHome, createPostTable, home } from "./route";
import { GroupService } from "./service/group.service";

const appPort = Bun.env.APP_PORT;

const postController = new PostController();

const groupService = new GroupService();

interface WebsocketData {
  user: {
    username: string;
  };
  groupId: string;
}

const getUser = (ws: ServerWebSocket<WebsocketData>) => ws.data.user.username;

Bun.serve<WebsocketData>({
  port: appPort,
  websocket: {
    message: (ws, message) => {
      const user = getUser(ws);
      const groupId = ws.data.groupId;

      if (typeof message === "string") {
        const data = {
          message: JSON.parse(message).message,
          userId: user,
          groupId,
        };

        groupService.saveChatMessage(data);

        const result = JSON.stringify(data);

        ws.publish(groupId, result);

        // ws.send(result);
      }
    },
    open: (ws) => {
      const user = getUser(ws);
      const groupId = ws.data.groupId;

      ws.subscribe(groupId);
      ws.publish(
        groupId,
        JSON.stringify({
          message: `${user} joined the chat.`,
        })
      );

      const history = groupService.getChats(groupId);

      ws.send(JSON.stringify(history));
    },
    close: (ws) => {
      const user = getUser(ws);
      const groupId = ws.data.groupId;

      ws.unsubscribe(groupId);
      ws.publish(
        groupId,
        JSON.stringify({
          message: `${user} left the chat.`,
        })
      );
    },
  },
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/chat") {
      const username = req.headers.get("x-user-id");
      const groupId = req.headers.get("x-group-id");

      if (groupId) {
        const group = groupService.getGroup(groupId);

        if (group) {
          const success = server.upgrade(req, {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              groupId,
              user: {
                username,
              },
            },
          });

          if (success) {
            return;
          }
        } else {
          return new Response(
            JSON.stringify({
              message: "Not Found",
            }),
            {
              status: 404,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      }
    }

    switch (url.pathname) {
      case req.method === "GET" && "/":
        return home();
      case req.method === "GET" && "/db":
        return asyncHome(req);
      case req.method === "GET" && "/create-table":
        return createPostTable();
      case req.method === "GET" && "/posts":
        return postController.index();
      case req.method === "GET" && "/posts":
        return postController.show(req);
      case req.method === "POST" && "/posts":
        return postController.create(req);
    }

    return new Response(
      JSON.stringify({
        message: "Not Found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
});

console.log("App running at port: ", appPort);
