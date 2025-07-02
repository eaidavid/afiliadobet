import { users, affiliateProfiles, bettingHouses, affiliateLinks, affiliateEvents, clicks, registrations, deposits, payments, type User, type InsertUser, type AffiliateProfile, type InsertAffiliateProfile, type BettingHouse, type InsertBettingHouse, type AffiliateLink, type InsertAffiliateLink, type AffiliateEvent, type InsertAffiliateEvent, type Click, type InsertClick, type Registration, type InsertRegistration, type Deposit, type InsertDeposit, type Payment, type InsertPayment } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, sum, gte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Affiliate profile operations
  getAffiliateProfile(userId: number): Promise<AffiliateProfile | undefined>;
  createAffiliateProfile(profile: InsertAffiliateProfile): Promise<AffiliateProfile>;
  updateAffiliateProfile(userId: number, updates: Partial<AffiliateProfile>): Promise<AffiliateProfile | undefined>;

  // Betting house operations
  getBettingHouses(): Promise<BettingHouse[]>;
  getBettingHouse(id: number): Promise<BettingHouse | undefined>;
  createBettingHouse(house: InsertBettingHouse): Promise<BettingHouse>;
  updateBettingHouse(id: number, updates: Partial<BettingHouse>): Promise<BettingHouse | undefined>;
  deleteBettingHouse(id: number): Promise<boolean>;

  // Affiliate link operations
  getAffiliateLinks(userId: number): Promise<AffiliateLink[]>;
  getAffiliateLinkByCode(code: string): Promise<AffiliateLink | undefined>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: number, updates: Partial<AffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: number): Promise<boolean>;

  // Tracking operations
  createClick(click: InsertClick): Promise<Click>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  createAffiliateEvent(event: InsertAffiliateEvent): Promise<AffiliateEvent>;

  // Analytics operations
  getAffiliateStats(userId: number): Promise<any>;
  getAdminStats(): Promise<any>;
  getTopAffiliates(limit?: number): Promise<any[]>;
  getAffiliatePerformance(userId: number, days?: number): Promise<any[]>;

  // Payment operations
  getPayments(userId?: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser as any).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAffiliateProfile(userId: number): Promise<AffiliateProfile | undefined> {
    const [profile] = await db.select().from(affiliateProfiles).where(eq(affiliateProfiles.userId, userId));
    return profile || undefined;
  }

  async createAffiliateProfile(profile: InsertAffiliateProfile): Promise<AffiliateProfile> {
    const [newProfile] = await db.insert(affiliateProfiles).values(profile).returning();
    return newProfile;
  }

  async updateAffiliateProfile(userId: number, updates: Partial<AffiliateProfile>): Promise<AffiliateProfile | undefined> {
    const [profile] = await db.update(affiliateProfiles).set(updates).where(eq(affiliateProfiles.userId, userId)).returning();
    return profile || undefined;
  }

  async getBettingHouses(): Promise<BettingHouse[]> {
    return await db.select().from(bettingHouses).where(eq(bettingHouses.isActive, true)).orderBy(bettingHouses.name);
  }

  async getBettingHouse(id: number): Promise<BettingHouse | undefined> {
    const [house] = await db.select().from(bettingHouses).where(eq(bettingHouses.id, id));
    return house || undefined;
  }

  async createBettingHouse(house: InsertBettingHouse): Promise<BettingHouse> {
    const [newHouse] = await db.insert(bettingHouses).values(house).returning();
    return newHouse;
  }

  async updateBettingHouse(id: number, updates: Partial<BettingHouse>): Promise<BettingHouse | undefined> {
    const [house] = await db.update(bettingHouses).set(updates).where(eq(bettingHouses.id, id)).returning();
    return house || undefined;
  }

  async deleteBettingHouse(id: number): Promise<boolean> {
    const result = await db.update(bettingHouses).set({ isActive: false }).where(eq(bettingHouses.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAffiliateLinks(userId: number): Promise<AffiliateLink[]> {
    return await db.select({
      id: affiliateLinks.id,
      userId: affiliateLinks.userId,
      bettingHouseId: affiliateLinks.bettingHouseId,
      linkCode: affiliateLinks.linkCode,
      fullUrl: affiliateLinks.fullUrl,
      customName: affiliateLinks.customName,
      campaign: affiliateLinks.campaign,
      isActive: affiliateLinks.isActive,
      clicks: affiliateLinks.clicks,
      conversions: affiliateLinks.conversions,
      totalCommission: affiliateLinks.totalCommission,
      createdAt: affiliateLinks.createdAt,
      bettingHouseName: bettingHouses.name,
    }).from(affiliateLinks)
      .leftJoin(bettingHouses, eq(affiliateLinks.bettingHouseId, bettingHouses.id))
      .where(eq(affiliateLinks.userId, userId))
      .orderBy(desc(affiliateLinks.createdAt));
  }

  async getAffiliateLinkByCode(code: string): Promise<AffiliateLink | undefined> {
    const [link] = await db.select().from(affiliateLinks).where(eq(affiliateLinks.linkCode, code));
    return link || undefined;
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const [newLink] = await db.insert(affiliateLinks).values(link).returning();
    return newLink;
  }

  async updateAffiliateLink(id: number, updates: Partial<AffiliateLink>): Promise<AffiliateLink | undefined> {
    const [link] = await db.update(affiliateLinks).set(updates).where(eq(affiliateLinks.id, id)).returning();
    return link || undefined;
  }

  async deleteAffiliateLink(id: number): Promise<boolean> {
    const result = await db.update(affiliateLinks).set({ isActive: false }).where(eq(affiliateLinks.id, id));
    return (result.rowCount || 0) > 0;
  }

  async createClick(click: InsertClick): Promise<Click> {
    const [newClick] = await db.insert(clicks).values(click).returning();
    
    // Update affiliate link click count
    await db.update(affiliateLinks)
      .set({ clicks: sql`${affiliateLinks.clicks} + 1` })
      .where(eq(affiliateLinks.id, click.affiliateLinkId));
    
    return newClick;
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db.insert(registrations).values(registration).returning();
    
    // Update affiliate link conversion count
    if (registration.cpaCommission) {
      await db.update(affiliateLinks)
        .set({ 
          conversions: sql`${affiliateLinks.conversions} + 1`,
          totalCommission: sql`${affiliateLinks.totalCommission} + ${registration.cpaCommission}`
        })
        .where(and(
          eq(affiliateLinks.userId, registration.affiliateId),
          eq(affiliateLinks.bettingHouseId, registration.bettingHouseId)
        ));
    }
    
    return newRegistration;
  }

  async createDeposit(deposit: InsertDeposit): Promise<Deposit> {
    const [newDeposit] = await db.insert(deposits).values(deposit).returning();
    
    // Update affiliate link commission
    await db.update(affiliateLinks)
      .set({ 
        totalCommission: sql`${affiliateLinks.totalCommission} + ${deposit.commissionAmount}`
      })
      .where(eq(affiliateLinks.userId, deposit.affiliateId));
    
    return newDeposit;
  }

  async createAffiliateEvent(event: InsertAffiliateEvent): Promise<AffiliateEvent> {
    const [newEvent] = await db.insert(affiliateEvents).values(event as any).returning();
    return newEvent;
  }

  async getAffiliateStats(userId: number): Promise<any> {
    // Get basic stats
    const [stats] = await db.select({
      totalClicks: sum(affiliateLinks.clicks),
      totalConversions: sum(affiliateLinks.conversions),
      totalCommission: sum(affiliateLinks.totalCommission),
      activeLinks: count(affiliateLinks.id)
    }).from(affiliateLinks).where(eq(affiliateLinks.userId, userId));

    // Get today's clicks
    const [todayClicks] = await db.select({
      count: count(clicks.id)
    }).from(clicks)
      .where(and(
        eq(clicks.affiliateId, userId),
        sql`DATE(${clicks.timestamp}) = CURRENT_DATE`
      ));

    // Get available balance from profile
    const profile = await this.getAffiliateProfile(userId);

    return {
      totalClicks: Number(stats.totalClicks) || 0,
      totalConversions: Number(stats.totalConversions) || 0,
      totalCommission: Number(stats.totalCommission) || 0,
      activeLinks: Number(stats.activeLinks) || 0,
      todayClicks: Number(todayClicks.count) || 0,
      availableBalance: Number(profile?.availableBalance) || 0,
      level: profile?.level || 'Novato',
      points: profile?.points || 0
    };
  }

  async getAdminStats(): Promise<any> {
    // Get total affiliates
    const [affiliateCount] = await db.select({
      count: count(users.id)
    }).from(users).where(eq(users.role, 'affiliate'));

    // Get total revenue
    const [revenue] = await db.select({
      total: sum(affiliateLinks.totalCommission)
    }).from(affiliateLinks);

    // Get total conversions
    const [conversions] = await db.select({
      total: sum(affiliateLinks.conversions)
    }).from(affiliateLinks);

    // Get total clicks
    const [clicksTotal] = await db.select({
      total: sum(affiliateLinks.clicks)
    }).from(affiliateLinks);

    const totalClicks = Number(clicksTotal.total) || 0;
    const totalConversions = Number(conversions.total) || 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(1) : '0.0';

    return {
      activeAffiliates: Number(affiliateCount.count) || 0,
      totalRevenue: Number(revenue.total) || 0,
      totalConversions: totalConversions,
      conversionRate: conversionRate
    };
  }

  async getTopAffiliates(limit: number = 5): Promise<any[]> {
    return await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      totalCommission: sum(affiliateLinks.totalCommission),
      conversions: sum(affiliateLinks.conversions)
    }).from(users)
      .leftJoin(affiliateLinks, eq(users.id, affiliateLinks.userId))
      .where(eq(users.role, 'affiliate'))
      .groupBy(users.id, users.fullName, users.email)
      .orderBy(desc(sum(affiliateLinks.totalCommission)))
      .limit(limit);
  }

  async getAffiliatePerformance(userId: number, days: number = 7): Promise<any[]> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    return await db.select({
      date: sql`DATE(${clicks.timestamp})`,
      clicks: count(clicks.id),
      conversions: count(registrations.id)
    }).from(clicks)
      .leftJoin(registrations, and(
        eq(clicks.affiliateId, registrations.affiliateId),
        sql`DATE(${clicks.timestamp}) = DATE(${registrations.timestamp})`
      ))
      .where(and(
        eq(clicks.affiliateId, userId),
        sql`${clicks.timestamp} >= ${daysAgo}`
      ))
      .groupBy(sql`DATE(${clicks.timestamp})`)
      .orderBy(sql`DATE(${clicks.timestamp})`);
  }

  async getPayments(userId?: number): Promise<Payment[]> {
    const query = db.select({
      id: payments.id,
      affiliateId: payments.affiliateId,
      amount: payments.amount,
      method: payments.method,
      pixKey: payments.pixKey,
      status: payments.status,
      processedAt: payments.processedAt,
      createdAt: payments.createdAt,
      affiliateName: users.fullName
    }).from(payments)
      .leftJoin(users, eq(payments.affiliateId, users.id))
      .orderBy(desc(payments.createdAt));

    if (userId) {
      return await query.where(eq(payments.affiliateId, userId));
    }

    return await query;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return payment || undefined;
  }
}

export const storage = new DatabaseStorage();
