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
  subscription_type: "free" | "lite" | "standard" | "enterprise";
  subscription_status: "active" | "expired" | "cancelled" | null;
  subscription_start: string | null;
  subscription_end: string | null;
  subscription_niche: string | null;
  subscription_role: "brand" | "individual" | null;
  onboarding_completed: boolean;
  oauth_provider: "google" | "facebook" | "tiktok" | null;
  oauth_provider_id: string | null;
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
      email: "admin@valyze.app",
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
        email: "admin@valyze.app",
        password: hashedPassword,
        role: "admin",
        disabled: false,
        subscription_type: "enterprise",
        subscription_status: "active",
        subscription_start: new Date().toISOString(),
        subscription_end: null,
        subscription_niche: null,
        subscription_role: null,
        onboarding_completed: true,
        oauth_provider: null,
        oauth_provider_id: null,
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

    // Try inserting with subscription field; fall back without it if column doesn't exist yet
    let user;
    let error;
    ({ data: user, error } = await supabase
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
      .single());

    if (error && error.message.includes("subscription_type")) {
      ({ data: user, error } = await supabase
        .from("users")
        .insert({
          username: data.username,
          email: data.email.toLowerCase(),
          password: hashedPassword,
          role: data.role || "user",
          disabled: false,
        })
        .select()
        .single());
    }

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
    subscription_niche: null,
    subscription_role: null,
    onboarding_completed: false,
    oauth_provider: null,
    oauth_provider_id: null,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveLocalUsers(users);
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, "role" | "disabled" | "username" | "email" | "subscription_type" | "subscription_status" | "subscription_start" | "subscription_end" | "subscription_niche" | "subscription_role" | "onboarding_completed" | "oauth_provider" | "oauth_provider_id">>
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

// ============================================================
// OAuth Helpers
// ============================================================

export async function findUserByEmail(email: string): Promise<User | null> {
  const lower = email.toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .ilike("email", lower)
      .limit(1)
      .single();
    return data as User | null;
  }

  return getLocalUsers().find((u) => u.email.toLowerCase() === lower) || null;
}

export async function findUserByOAuth(
  provider: "google" | "facebook" | "tiktok",
  providerId: string
): Promise<User | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("oauth_provider", provider)
      .eq("oauth_provider_id", providerId)
      .limit(1)
      .single();
    return data as User | null;
  }

  return (
    getLocalUsers().find(
      (u) => u.oauth_provider === provider && u.oauth_provider_id === providerId
    ) || null
  );
}

export async function createOAuthUser(data: {
  email: string;
  username: string;
  oauth_provider: "google" | "facebook" | "tiktok";
  oauth_provider_id: string;
}): Promise<User> {
  // OAuth kullanıcıları için random şifre oluştur (direkt giriş yapamaz)
  const randomPassword = nanoid(32);
  const hashedPassword = await bcrypt.hash(randomPassword, 12);

  if (isSupabaseConfigured && supabase) {
    // Username çakışması kontrol et
    let username = data.username;
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .ilike("username", username)
      .limit(1);
    if (existing && existing.length > 0) {
      username = `${username}_${nanoid(4)}`;
    }

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        username,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: "user",
        disabled: false,
        subscription_type: "free",
        oauth_provider: data.oauth_provider,
        oauth_provider_id: data.oauth_provider_id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return user as User;
  }

  // JSON fallback
  const users = getLocalUsers();
  let username = data.username;
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    username = `${username}_${nanoid(4)}`;
  }

  const user: User = {
    id: nanoid(),
    username,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: "user",
    disabled: false,
    subscription_type: "free",
    subscription_status: null,
    subscription_start: null,
    subscription_end: null,
    subscription_niche: null,
    subscription_role: null,
    onboarding_completed: false,
    oauth_provider: data.oauth_provider,
    oauth_provider_id: data.oauth_provider_id,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveLocalUsers(users);
  return user;
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

// ============================================================
// Payment & Subscription Tables
// ============================================================

export interface Payment {
  id: string;
  user_id: string;
  payment_type: "single" | "subscription";
  iyzico_payment_id: string | null;
  iyzico_token: string;
  conversation_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failure" | "refunded";
  period_start: string | null;
  period_end: string | null;
  card_last_four: string | null;
  card_type: string | null;
  error_message: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  iyzico_subscription_ref: string | null;
  iyzico_customer_ref: string | null;
  status: "active" | "past_due" | "cancelled" | "expired";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Payment JSON Fallback ────────────────────────────────
const PAYMENTS_PATH = path.join(process.cwd(), "data", "payments.json");
const SUBSCRIPTIONS_PATH = path.join(process.cwd(), "data", "subscriptions.json");

function getLocalPayments(): Payment[] {
  const dir = path.dirname(PAYMENTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PAYMENTS_PATH)) fs.writeFileSync(PAYMENTS_PATH, "[]", "utf-8");
  return JSON.parse(fs.readFileSync(PAYMENTS_PATH, "utf-8")) as Payment[];
}

function saveLocalPayments(payments: Payment[]): void {
  const dir = path.dirname(PAYMENTS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(PAYMENTS_PATH, JSON.stringify(payments, null, 2), "utf-8");
}

function getLocalSubscriptions(): Subscription[] {
  const dir = path.dirname(SUBSCRIPTIONS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SUBSCRIPTIONS_PATH)) fs.writeFileSync(SUBSCRIPTIONS_PATH, "[]", "utf-8");
  return JSON.parse(fs.readFileSync(SUBSCRIPTIONS_PATH, "utf-8")) as Subscription[];
}

function saveLocalSubscriptions(subscriptions: Subscription[]): void {
  const dir = path.dirname(SUBSCRIPTIONS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SUBSCRIPTIONS_PATH, JSON.stringify(subscriptions, null, 2), "utf-8");
}

// ─── Payment CRUD ────────────────────────────────────────

export async function createPayment(data: {
  user_id: string;
  payment_type: "single" | "subscription";
  iyzico_token: string;
  conversation_id?: string;
  amount: number;
  currency?: string;
}): Promise<Payment> {
  const payment: Payment = {
    id: nanoid(),
    user_id: data.user_id,
    payment_type: data.payment_type,
    iyzico_payment_id: null,
    iyzico_token: data.iyzico_token,
    conversation_id: data.conversation_id || null,
    amount: data.amount,
    currency: data.currency || "TRY",
    status: "pending",
    period_start: null,
    period_end: null,
    card_last_four: null,
    card_type: null,
    error_message: null,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data: row, error } = await supabase
      .from("payments")
      .insert(payment)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as Payment;
  }

  const payments = getLocalPayments();
  payments.push(payment);
  saveLocalPayments(payments);
  return payment;
}

export async function updatePayment(
  id: string,
  data: Partial<Pick<Payment, "status" | "iyzico_payment_id" | "period_start" | "period_end" | "card_last_four" | "card_type" | "error_message">>
): Promise<Payment | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: row, error } = await supabase
      .from("payments")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) return null;
    return row as Payment;
  }

  const payments = getLocalPayments();
  const index = payments.findIndex((p) => p.id === id);
  if (index === -1) return null;
  payments[index] = { ...payments[index], ...data };
  saveLocalPayments(payments);
  return payments[index];
}

export async function findPaymentByToken(token: string): Promise<Payment | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("iyzico_token", token)
      .single();
    return data as Payment | null;
  }

  return getLocalPayments().find((p) => p.iyzico_token === token) || null;
}

export async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data || []) as Payment[];
  }

  return getLocalPayments()
    .filter((p) => p.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ─── Subscription CRUD ────────────────────────────────────

export async function createSubscription(data: {
  user_id: string;
  iyzico_subscription_ref?: string;
  iyzico_customer_ref?: string;
  current_period_start: string;
  current_period_end: string;
}): Promise<Subscription> {
  const now = new Date().toISOString();
  const subscription: Subscription = {
    id: nanoid(),
    user_id: data.user_id,
    iyzico_subscription_ref: data.iyzico_subscription_ref || null,
    iyzico_customer_ref: data.iyzico_customer_ref || null,
    status: "active",
    current_period_start: data.current_period_start,
    current_period_end: data.current_period_end,
    cancel_at_period_end: false,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    // Upsert — bir kullanıcının tek subscription'ı olabilir
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", data.user_id)
      .single();

    if (existing) {
      const { data: row, error } = await supabase
        .from("subscriptions")
        .update({
          ...subscription,
          id: existing.id,
          updated_at: now,
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return row as Subscription;
    }

    const { data: row, error } = await supabase
      .from("subscriptions")
      .insert(subscription)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as Subscription;
  }

  // JSON fallback — upsert
  const subs = getLocalSubscriptions();
  const existingIndex = subs.findIndex((s) => s.user_id === data.user_id);
  if (existingIndex >= 0) {
    subs[existingIndex] = { ...subscription, id: subs[existingIndex].id, updated_at: now };
    saveLocalSubscriptions(subs);
    return subs[existingIndex];
  }
  subs.push(subscription);
  saveLocalSubscriptions(subs);
  return subscription;
}

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();
    return data as Subscription | null;
  }

  return getLocalSubscriptions().find((s) => s.user_id === userId) || null;
}

export async function updateSubscription(
  id: string,
  data: Partial<Pick<Subscription, "status" | "current_period_start" | "current_period_end" | "cancel_at_period_end" | "iyzico_subscription_ref" | "iyzico_customer_ref">>
): Promise<Subscription | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: row, error } = await supabase
      .from("subscriptions")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) return null;
    return row as Subscription;
  }

  const subs = getLocalSubscriptions();
  const index = subs.findIndex((s) => s.id === id);
  if (index === -1) return null;
  subs[index] = { ...subs[index], ...data, updated_at: new Date().toISOString() };
  saveLocalSubscriptions(subs);
  return subs[index];
}

export async function getExpiredPaidUsers(): Promise<User[]> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .neq("subscription_type", "free")
      .lt("subscription_end", now)
      .not("subscription_end", "is", null);
    return (data || []) as User[];
  }

  return getLocalUsers().filter(
    (u) =>
      u.subscription_type !== "free" &&
      u.subscription_end !== null &&
      new Date(u.subscription_end) < new Date()
  );
}
