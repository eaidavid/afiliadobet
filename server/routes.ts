import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import passport, { isAuthenticated, isAdmin, isAffiliate, hashPassword } from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertBettingHouseSchema, insertAffiliateLinkSchema } from "@shared/schema";
import { nanoid } from "nanoid";

const MemStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    store: new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // set to true in production with HTTPS
      httpOnly: true
    }
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    const user = req.user as any;
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", isAuthenticated, async (req, res) => {
    const user = req.user as any;
    let profile = null;
    
    if (user.role === 'affiliate') {
      profile = await storage.getAffiliateProfile(user.id);
    }
    
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      profile
    });
  });

  // Registration route (only for affiliates)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        role: 'affiliate'
      });

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Create affiliate profile
      await storage.createAffiliateProfile({
        userId: user.id,
        points: 0,
        level: 'Novato',
        totalCommission: '0',
        availableBalance: '0'
      });

      res.status(201).json({ message: "Conta criada com sucesso" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Erro ao criar conta" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  app.get("/api/admin/top-affiliates", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const topAffiliates = await storage.getTopAffiliates(5);
      res.json(topAffiliates);
    } catch (error) {
      console.error("Error fetching top affiliates:", error);
      res.status(500).json({ message: "Erro ao buscar top afiliados" });
    }
  });

  app.get("/api/admin/affiliates", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // This would need a more complex query to get affiliate data with stats
      // For now, return basic structure
      res.json([]);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      res.status(500).json({ message: "Erro ao buscar afiliados" });
    }
  });

  // Betting houses routes
  app.get("/api/betting-houses", isAuthenticated, async (req, res) => {
    try {
      const houses = await storage.getBettingHouses();
      res.json(houses);
    } catch (error) {
      console.error("Error fetching betting houses:", error);
      res.status(500).json({ message: "Erro ao buscar casas de apostas" });
    }
  });

  app.post("/api/betting-houses", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const houseData = insertBettingHouseSchema.parse(req.body);
      const house = await storage.createBettingHouse(houseData);
      res.status(201).json(house);
    } catch (error) {
      console.error("Error creating betting house:", error);
      res.status(400).json({ message: "Erro ao criar casa de apostas" });
    }
  });

  app.put("/api/betting-houses/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const house = await storage.updateBettingHouse(id, updates);
      if (!house) {
        return res.status(404).json({ message: "Casa de apostas não encontrada" });
      }
      res.json(house);
    } catch (error) {
      console.error("Error updating betting house:", error);
      res.status(400).json({ message: "Erro ao atualizar casa de apostas" });
    }
  });

  app.delete("/api/betting-houses/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBettingHouse(id);
      if (!success) {
        return res.status(404).json({ message: "Casa de apostas não encontrada" });
      }
      res.json({ message: "Casa de apostas removida com sucesso" });
    } catch (error) {
      console.error("Error deleting betting house:", error);
      res.status(500).json({ message: "Erro ao remover casa de apostas" });
    }
  });

  // Affiliate link routes
  app.get("/api/affiliate-links", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const links = await storage.getAffiliateLinks(user.id);
      res.json(links);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      res.status(500).json({ message: "Erro ao buscar links" });
    }
  });

  app.post("/api/affiliate-links", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const linkCode = nanoid(10);
      
      const linkData = insertAffiliateLinkSchema.parse({
        ...req.body,
        userId: user.id,
        linkCode,
        fullUrl: `${req.protocol}://${req.get('host')}/ref/${linkCode}`
      });

      const link = await storage.createAffiliateLink(linkData);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating affiliate link:", error);
      res.status(400).json({ message: "Erro ao criar link" });
    }
  });

  app.put("/api/affiliate-links/:id", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const link = await storage.updateAffiliateLink(id, updates);
      if (!link) {
        return res.status(404).json({ message: "Link não encontrado" });
      }
      res.json(link);
    } catch (error) {
      console.error("Error updating affiliate link:", error);
      res.status(400).json({ message: "Erro ao atualizar link" });
    }
  });

  app.delete("/api/affiliate-links/:id", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAffiliateLink(id);
      if (!success) {
        return res.status(404).json({ message: "Link não encontrado" });
      }
      res.json({ message: "Link removido com sucesso" });
    } catch (error) {
      console.error("Error deleting affiliate link:", error);
      res.status(500).json({ message: "Erro ao remover link" });
    }
  });

  // Affiliate stats routes
  app.get("/api/affiliate/stats", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const stats = await storage.getAffiliateStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  app.get("/api/affiliate/performance", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const days = parseInt(req.query.days as string) || 7;
      const performance = await storage.getAffiliatePerformance(user.id, days);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching affiliate performance:", error);
      res.status(500).json({ message: "Erro ao buscar performance" });
    }
  });

  // Payment routes
  app.get("/api/payments", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const payments = await storage.getPayments(user.role === 'admin' ? undefined : user.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Erro ao buscar pagamentos" });
    }
  });

  app.post("/api/payments", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const paymentData = {
        ...req.body,
        affiliateId: user.id
      };
      
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(400).json({ message: "Erro ao solicitar pagamento" });
    }
  });

  // Tracking routes
  app.get("/ref/:subid", async (req, res) => {
    try {
      const { subid } = req.params;
      const link = await storage.getAffiliateLinkByCode(subid);
      
      if (!link) {
        return res.status(404).json({ message: "Link não encontrado" });
      }

      // Record click
      await storage.createClick({
        affiliateId: link.userId,
        affiliateLinkId: link.id,
        ipAddress: req.ip || req.connection.remoteAddress || '',
        userAgent: req.get('User-Agent') || '',
        referrer: req.get('Referer')
      });

      // Set tracking cookie
      res.cookie('affiliate_tracking', JSON.stringify({
        affiliateId: link.userId,
        bettingHouseId: link.bettingHouseId,
        linkId: link.id,
        timestamp: Date.now()
      }), {
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        httpOnly: true
      });

      // Get betting house for redirect
      const bettingHouse = await storage.getBettingHouse(link.bettingHouseId);
      if (bettingHouse) {
        res.redirect(bettingHouse.websiteUrl);
      } else {
        res.status(404).json({ message: "Casa de apostas não encontrada" });
      }
    } catch (error) {
      console.error("Error handling referral click:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  app.post("/api/tracking/registration", async (req, res) => {
    try {
      const { username, email } = req.body;
      const trackingCookie = req.cookies.affiliate_tracking;
      
      if (!trackingCookie) {
        return res.status(400).json({ message: "Tracking cookie não encontrado" });
      }

      const tracking = JSON.parse(trackingCookie);
      const bettingHouse = await storage.getBettingHouse(tracking.bettingHouseId);
      
      if (!bettingHouse) {
        return res.status(400).json({ message: "Casa de apostas não encontrada" });
      }

      // Calculate CPA commission
      const cpaCommission = bettingHouse.baseCpaCommission;

      // Create registration
      await storage.createRegistration({
        affiliateId: tracking.affiliateId,
        bettingHouseId: tracking.bettingHouseId,
        username,
        email,
        cpaCommission: cpaCommission.toString()
      });

      // Create affiliate event
      await storage.createAffiliateEvent({
        subid: tracking.linkId.toString(),
        eventType: 'registration',
        affiliateId: tracking.affiliateId,
        bettingHouseId: tracking.bettingHouseId,
        commissionAmount: cpaCommission.toString(),
        status: 'confirmed'
      });

      res.json({ message: "Registro rastreado com sucesso" });
    } catch (error) {
      console.error("Error tracking registration:", error);
      res.status(500).json({ message: "Erro ao rastrear registro" });
    }
  });

  app.post("/api/tracking/deposit", async (req, res) => {
    try {
      const { username, amount } = req.body;
      const trackingCookie = req.cookies.affiliate_tracking;
      
      if (!trackingCookie) {
        return res.status(400).json({ message: "Tracking cookie não encontrado" });
      }

      const tracking = JSON.parse(trackingCookie);
      const bettingHouse = await storage.getBettingHouse(tracking.bettingHouseId);
      
      if (!bettingHouse) {
        return res.status(400).json({ message: "Casa de apostas não encontrada" });
      }

      // Calculate RevShare commission
      const commissionAmount = (parseFloat(amount) * parseFloat(bettingHouse.baseRevSharePercent.toString())) / 100;

      // Find registration
      // This is a simplified version - in production you'd want better user matching
      
      // Create deposit record
      await storage.createDeposit({
        registrationId: 1, // This should be properly linked to the registration
        affiliateId: tracking.affiliateId,
        amount: amount.toString(),
        commissionAmount: commissionAmount.toString(),
        status: 'confirmed'
      });

      // Create affiliate event
      await storage.createAffiliateEvent({
        subid: tracking.linkId.toString(),
        eventType: 'deposit',
        affiliateId: tracking.affiliateId,
        bettingHouseId: tracking.bettingHouseId,
        depositAmount: amount.toString(),
        commissionAmount: commissionAmount.toString(),
        status: 'confirmed'
      });

      res.json({ message: "Depósito rastreado com sucesso" });
    } catch (error) {
      console.error("Error tracking deposit:", error);
      res.status(500).json({ message: "Erro ao rastrear depósito" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
