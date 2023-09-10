import db from "../db";

interface ChatData {
  id: string;
  message: string;
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export class GroupService {
  getGroups() {
    const query = db.query("Select * from groups");
    const result = query.all();

    return result;
  }

  getGroup(id: string) {
    const query = db.query("Select * from groups WHERE id = $id");
    const result = query.get({
      $id: id,
    });

    if (!result) {
      return null;
    }

    return result;
  }

  getChats(groupId: string) {
    const query = db.query(
      "Select * from chats WHERE groupId = $id ORDER BY createdAt DESC;"
    );
    const result = query.all({
      $id: Number(groupId),
    });

    return result;
  }

  saveChatMessage(data: Omit<ChatData, "id" | "createdAt" | "updatedAt">) {
    const query = db.query(
      "INSERT INTO chats(message, userId, groupId, createdAt, updatedAt) values($message, $userId, $groupId, $createdAt, $updatedAt)"
    );
    const date = new Date().toISOString();

    query.run({
      $message: data.message,
      $userId: data.userId,
      $groupId: Number(data.groupId),
      $createdAt: date,
      $updatedAt: date,
    });
  }
}
