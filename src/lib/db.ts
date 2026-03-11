import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  disabled: boolean;
  subscription_type: "free" | "premium";
  subscription_status: "active" | "expired" | "cancelled" | null;
  subscription_start: string | null;
  subscription_end: string | null;
  created_at: string;
}

// ============================================================
// JSON File Fallback (local development without Supabase)
// ============================================================

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

function getLocalUsers(): User[] {
  ensureDbExists();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as User[];
}

function saveLocalUsers(users: User[]): void {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

// ============================================================
// Public API — automatically routes to Supabase or JSON file
// ============================================================

export async function seedDefaultAdmin(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    if (count && count > 0) return;

    const hashedPassword = await bcrypt.hash("antmalya4407", 12);
    await supabase.from("users").insert({
      username: "admin",
      email: "admin@tiktrendtr.com",
      password: hashedPassword,
      role: "admin",
      disabled: false,
    });
  } else {
    const users = getLocalUsers();
    if (users.length > 0) return;

    const hashedPassword = await bcrypt.hash("antmalya4407", 12);
    saveLocalUsers([
      {
        id: nanoid(),
        username: "admin",
        email: "admin@tiktrendtr.com",
        password: hashedPassword,
        role: "admin",
        disabled: false,
        subscription_type: "premium",
        subscription_status: "active",
        subscription_start: new Date().toISOString(),
        subscription_end: null,
        created_at: new Date().toISOString(),
      },
    ]);
  }
}

export async function findUserByEmailOrUsername(
  identifier: string
): Promise<User | null> {
  const lower = identifier.toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .or(`email.ilike.${lower},username.ilike.${lower}`)
      .limit(1)
      .single();
    return data as User | null;
  }

  return (
    getLocalUsers().find(
      (u) =>
        u.email.toLowerCase() === lower ||
        u.username.toLowerCase() === lower
    ) || null
  );
}

export async function findUserById(id: string): Promise<User | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    return data as User | null;
  }

  return getLocalUsers().find((u) => u.id === id) || null;
}

export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}): Promise<User> {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  if (isSupabaseConfigured && supabase) {
    const { data: existingEmail } = await supabase
      .from("users")
      .select("id")
      .ilike("email", data.email)
      .limit(1);
    if (existingEmail && existingEmail.length > 0) {
      throw new Error("Bu e-posta adresi zaten kullanılıyor");
    }

    const { data: existingUsername } = await supabase
      .from("users")
      .select("id")
      .ilike("username", data.username)
      .limit(1);
    if (existingUsername && existingUsername.length > 0) {
      throw new Error("Bu kullanıcı adı zaten kullanılıyor");
    }

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        username: data.username,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: data.role || "user",
        disabled: false,
        subscription_type: "free",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return user as User;
  }

  // JSON fallback
  const users = getLocalUsers();
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

  const user: User = {
    id: nanoid(),
    username: data.username,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role || "user",
    disabled: false,
    subscription_type: "free",
    subscription_status: null,
    subscription_start: null,
    subscription_end: null,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveLocalUsers(users);
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "role" | "disabled" | "username" | "email" | "subscription_type" | "subscription_status" | "subscription_start" | "subscription_end">>
): Promise<User | null> {
  if (isSupabaseConfigured && supabase) {
    if (data.email) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .ilike("email", data.email)
        .neq("id", id)
        .limit(1);
      if (existing && existing.length > 0) {
        throw new Error("Bu e-posta adresi zaten kullanılıyor");
      }
      data.email = data.email.toLowerCase();
    }
    if (data.username) {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .ilike("username", data.username)
        .neq("id", id)
        .limit(1);
      if (existing && existing.length > 0) {
        throw new Error("Bu kullanıcı adı zaten kullanılıyor");
      }
    }

    const { data: user, error } = await supabase
      .from("users")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) return null;
    return user as User;
  }

  // JSON fallback
  const users = getLocalUsers();
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
        u.username.toLowerCase() === data.username!.toLowerCase() &&
        u.id !== id
    );
    if (existing) throw new Error("Bu kullanıcı adı zaten kullanılıyor");
  }

  users[index] = { ...users[index], ...data };
  saveLocalUsers(users);
  return users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("users").delete().eq("id", id);
    return !error;
  }

  const users = getLocalUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  saveLocalUsers(filtered);
  return true;
}

export async function getAllUsersPublic(): Promise<Omit<User, "password">[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("users")
      .select("id, username, email, role, disabled, created_at")
      .order("created_at", { ascending: true });
    return (data || []) as Omit<User, "password">[];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return getLocalUsers().map(({ password: _pw, ...user }) => user);
}
