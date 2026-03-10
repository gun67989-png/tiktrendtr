import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  disabled: boolean;
  created_at: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDbExists(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getUsers(): User[] {
  ensureDbExists();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as User[];
}

function saveUsers(users: User[]): void {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function seedDefaultAdmin(): Promise<void> {
  const users = getUsers();
  if (users.length > 0) return;

  const hashedPassword = await bcrypt.hash("antmalya4407", 12);
  const admin: User = {
    id: nanoid(),
    username: "admin",
    email: "admin@tiktrendtr.com",
    password: hashedPassword,
    role: "admin",
    disabled: false,
    created_at: new Date().toISOString(),
  };
  saveUsers([admin]);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUsername(username: string): User | undefined {
  return getUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

export function findUserByEmailOrUsername(identifier: string): User | undefined {
  const lower = identifier.toLowerCase();
  return getUsers().find(
    (u) => u.email.toLowerCase() === lower || u.username.toLowerCase() === lower
  );
}

export function findUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}): Promise<User> {
  const users = getUsers();

  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("Bu e-posta adresi zaten kullanılıyor");
  }
  if (
    users.some(
      (u) => u.username.toLowerCase() === data.username.toLowerCase()
    )
  ) {
    throw new Error("Bu kullanıcı adı zaten kullanılıyor");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user: User = {
    id: nanoid(),
    username: data.username,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role || "user",
    disabled: false,
    created_at: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(
  id: string,
  data: Partial<Pick<User, "role" | "disabled" | "username" | "email">>
): User | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  if (data.email) {
    const existing = users.find(
      (u) => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== id
    );
    if (existing) throw new Error("Bu e-posta adresi zaten kullanılıyor");
    data.email = data.email.toLowerCase();
  }

  if (data.username) {
    const existing = users.find(
      (u) =>
        u.username.toLowerCase() === data.username!.toLowerCase() && u.id !== id
    );
    if (existing) throw new Error("Bu kullanıcı adı zaten kullanılıyor");
  }

  users[index] = { ...users[index], ...data };
  saveUsers(users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

export function getAllUsersPublic(): Omit<User, "password">[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return getUsers().map(({ password: _pw, ...user }) => user);
}
