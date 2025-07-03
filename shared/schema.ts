import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (both admins and affiliates)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().$type<"admin" | "affiliate">(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Affiliate profiles (specific data for affiliates)
export const affiliateProfiles = pgTable("affiliate_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  points: integer("points").default(0).notNull(),
  level: varchar("level", { length: 50 }).default("Novato").notNull(),
  totalCommission: decimal("total_commission", { precision: 10, scale: 2 }).default("0").notNull(),
  availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).default("0").notNull(),
  pixKey: varchar("pix_key", { length: 255 }),
  bankAccount: text("bank_account"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zip_code", { length: 10 }),
  cpf: varchar("cpf", { length: 14 }),
  birthDate: varchar("birth_date", { length: 10 }),
  profilePhoto: text("profile_photo"),
  bio: text("bio"),
  preferredPaymentMethod: varchar("preferred_payment_method", { length: 50 }).default("PIX"),
  bankName: varchar("bank_name", { length: 100 }),
  agency: varchar("agency", { length: 20 }),
  account: varchar("account", { length: 20 }),
  accountType: varchar("account_type", { length: 20 }).default("checking"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Betting houses
export const bettingHouses = pgTable("betting_houses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url").notNull(),
  baseCpaCommission: decimal("base_cpa_commission", { precision: 10, scale: 2 }).notNull(),
  baseRevSharePercent: decimal("base_rev_share_percent", { precision: 5, scale: 2 }).notNull(),
  cookieDuration: integer("cookie_duration").default(90).notNull(), // days
  isActive: boolean("is_active").default(true).notNull(),
  category: varchar("category", { length: 100 }).default("sports").notNull(),
  commissionType: varchar("commission_type", { length: 20 }).default("CPA").notNull().$type<"CPA" | "RevShare" | "Hybrid">(),
  // Configurações de postback
  postbackUrl: text("postback_url"),
  postbackToken: varchar("postback_token", { length: 255 }),
  apiUrl: text("api_url"),
  apiKey: varchar("api_key", { length: 255 }),
  authMethod: varchar("auth_method", { length: 20 }).default("Bearer"),
  syncInterval: integer("sync_interval").default(60), // minutes
  integrationMethod: varchar("integration_method", { length: 20 }).default("postback").$type<"postback" | "api">(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Affiliate links
export const affiliateLinks = pgTable("affiliate_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bettingHouseId: integer("betting_house_id").references(() => bettingHouses.id).notNull(),
  linkCode: varchar("link_code", { length: 100 }).notNull().unique(),
  fullUrl: text("full_url").notNull(),
  customName: varchar("custom_name", { length: 255 }),
  campaign: varchar("campaign", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  conversions: integer("conversions").default(0).notNull(),
  totalCommission: decimal("total_commission", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Affiliate events (tracking)
export const affiliateEvents = pgTable("affiliate_events", {
  id: serial("id").primaryKey(),
  subid: varchar("subid", { length: 100 }).notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull().$type<"click" | "registration" | "deposit">(),
  affiliateId: integer("affiliate_id").references(() => users.id).notNull(),
  bettingHouseId: integer("betting_house_id").references(() => bettingHouses.id).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Clicks tracking
export const clicks = pgTable("clicks", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => users.id).notNull(),
  affiliateLinkId: integer("affiliate_link_id").references(() => affiliateLinks.id).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  converted: boolean("converted").default(false).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Registrations
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => users.id).notNull(),
  bettingHouseId: integer("betting_house_id").references(() => bettingHouses.id).notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  deposited: boolean("deposited").default(false).notNull(),
  cpaCommission: decimal("cpa_commission", { precision: 10, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Deposits
export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id").references(() => registrations.id).notNull(),
  affiliateId: integer("affiliate_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Payments
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  affiliateId: integer("affiliate_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull(),
  pixKey: varchar("pix_key", { length: 255 }),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  affiliateProfile: one(affiliateProfiles, {
    fields: [users.id],
    references: [affiliateProfiles.userId],
  }),
  affiliateLinks: many(affiliateLinks),
  affiliateEvents: many(affiliateEvents),
  clicks: many(clicks),
  registrations: many(registrations),
  deposits: many(deposits),
  payments: many(payments),
}));

export const affiliateProfilesRelations = relations(affiliateProfiles, ({ one }) => ({
  user: one(users, {
    fields: [affiliateProfiles.userId],
    references: [users.id],
  }),
}));

export const bettingHousesRelations = relations(bettingHouses, ({ many }) => ({
  affiliateLinks: many(affiliateLinks),
  affiliateEvents: many(affiliateEvents),
  registrations: many(registrations),
}));

export const affiliateLinksRelations = relations(affiliateLinks, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliateLinks.userId],
    references: [users.id],
  }),
  bettingHouse: one(bettingHouses, {
    fields: [affiliateLinks.bettingHouseId],
    references: [bettingHouses.id],
  }),
  clicks: many(clicks),
}));

export const affiliateEventsRelations = relations(affiliateEvents, ({ one }) => ({
  affiliate: one(users, {
    fields: [affiliateEvents.affiliateId],
    references: [users.id],
  }),
  bettingHouse: one(bettingHouses, {
    fields: [affiliateEvents.bettingHouseId],
    references: [bettingHouses.id],
  }),
}));

export const clicksRelations = relations(clicks, ({ one }) => ({
  affiliate: one(users, {
    fields: [clicks.affiliateId],
    references: [users.id],
  }),
  affiliateLink: one(affiliateLinks, {
    fields: [clicks.affiliateLinkId],
    references: [affiliateLinks.id],
  }),
}));

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
  affiliate: one(users, {
    fields: [registrations.affiliateId],
    references: [users.id],
  }),
  bettingHouse: one(bettingHouses, {
    fields: [registrations.bettingHouseId],
    references: [bettingHouses.id],
  }),
  deposits: many(deposits),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  registration: one(registrations, {
    fields: [deposits.registrationId],
    references: [registrations.id],
  }),
  affiliate: one(users, {
    fields: [deposits.affiliateId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  affiliate: one(users, {
    fields: [payments.affiliateId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAffiliateProfileSchema = createInsertSchema(affiliateProfiles).omit({
  id: true,
});

export const insertBettingHouseSchema = createInsertSchema(bettingHouses).omit({
  id: true,
  createdAt: true,
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  createdAt: true,
  clicks: true,
  conversions: true,
  totalCommission: true,
});

export const insertAffiliateEventSchema = createInsertSchema(affiliateEvents).omit({
  id: true,
  timestamp: true,
});

export const insertClickSchema = createInsertSchema(clicks).omit({
  id: true,
  timestamp: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  timestamp: true,
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  timestamp: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AffiliateProfile = typeof affiliateProfiles.$inferSelect;
export type InsertAffiliateProfile = z.infer<typeof insertAffiliateProfileSchema>;
export type BettingHouse = typeof bettingHouses.$inferSelect;
export type InsertBettingHouse = z.infer<typeof insertBettingHouseSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateEvent = typeof affiliateEvents.$inferSelect;
export type InsertAffiliateEvent = z.infer<typeof insertAffiliateEventSchema>;
export type Click = typeof clicks.$inferSelect;
export type InsertClick = z.infer<typeof insertClickSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
