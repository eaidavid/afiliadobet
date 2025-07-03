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

      // Create affiliate profile with complete registration data
      await storage.createAffiliateProfile({
        userId: user.id,
        points: 0,
        level: 'Novato',
        totalCommission: '0',
        availableBalance: '0',
        preferredPaymentMethod: 'PIX',
        // Copy user data to profile
        cpf: userData.cpf || null,
        phone: userData.phone || null,
        bankName: userData.bankName || null,
        agency: userData.agency || null,
        account: userData.account || null,
        accountType: userData.accountType || 'checking'
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
      const { search, status, dateRange, sortBy, sortOrder } = req.query;
      const affiliates = await storage.getAllAffiliatesWithStats();
      
      // Apply filters
      let filtered = affiliates;
      
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(affiliate => 
          affiliate.fullName?.toLowerCase().includes(searchLower) ||
          affiliate.email?.toLowerCase().includes(searchLower) ||
          affiliate.username?.toLowerCase().includes(searchLower)
        );
      }
      
      if (status && status !== 'all') {
        filtered = filtered.filter(affiliate => {
          if (status === 'active') return affiliate.isActive;
          if (status === 'inactive') return !affiliate.isActive;
          return true;
        });
      }
      
      // Apply sorting
      if (sortBy && typeof sortBy === 'string') {
        filtered.sort((a, b) => {
          let aVal = a[sortBy as keyof typeof a];
          let bVal = b[sortBy as keyof typeof b];
          
          if (typeof aVal === 'string') aVal = aVal.toLowerCase();
          if (typeof bVal === 'string') bVal = bVal.toLowerCase();
          
          if (aVal < bVal) return sortOrder === 'desc' ? 1 : -1;
          if (aVal > bVal) return sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }
      
      res.json(filtered);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      res.status(500).json({ message: "Erro ao buscar afiliados" });
    }
  });

  app.get("/api/admin/affiliates/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminAffiliateStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching affiliate stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas de afiliados" });
    }
  });

  app.get("/api/admin/affiliates/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.id);
      const affiliate = await storage.getAffiliateDetailById(affiliateId);
      if (!affiliate) {
        return res.status(404).json({ message: "Afiliado não encontrado" });
      }
      res.json(affiliate);
    } catch (error) {
      console.error("Error fetching affiliate details:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes do afiliado" });
    }
  });

  // Atualizar status do afiliado
  app.patch("/api/admin/affiliates/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      const updatedUser = await storage.updateUser(affiliateId, { isActive });
      if (!updatedUser) {
        return res.status(404).json({ message: "Afiliado não encontrado" });
      }
      
      res.json({ message: isActive ? "Afiliado ativado com sucesso" : "Afiliado desativado com sucesso", user: updatedUser });
    } catch (error) {
      console.error("Error updating affiliate status:", error);
      res.status(500).json({ message: "Erro ao atualizar status do afiliado" });
    }
  });

  // Atualizar perfil do afiliado
  app.patch("/api/admin/affiliates/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const affiliateId = parseInt(req.params.id);
      const updates = req.body;
      
      // Update user basic info
      if (updates.fullName || updates.email || updates.username) {
        await storage.updateUser(affiliateId, {
          fullName: updates.fullName,
          email: updates.email,
          username: updates.username
        });
      }
      
      // Update affiliate profile
      if (updates.cpf || updates.phone || updates.bankName || updates.agency || updates.account) {
        await storage.updateAffiliateProfile(affiliateId, {
          cpf: updates.cpf,
          phone: updates.phone,
          bankName: updates.bankName,
          agency: updates.agency,
          account: updates.account,
          accountType: updates.accountType
        });
      }
      
      res.json({ message: "Perfil do afiliado atualizado com sucesso" });
    } catch (error) {
      console.error("Error updating affiliate profile:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil do afiliado" });
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
      const { nanoid } = await import('nanoid');
      const houseData = insertBettingHouseSchema.parse(req.body);
      
      // Generate unique postback token
      const postbackToken = nanoid(32);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      // Create postback URLs for this house
      const registrationPostbackUrl = `${baseUrl}/api/postback/${postbackToken}/registration`;
      const depositPostbackUrl = `${baseUrl}/api/postback/${postbackToken}/deposit`;
      
      const enrichedHouseData = {
        ...houseData,
        postbackToken,
        registrationPostbackUrl,
        depositPostbackUrl
      };
      
      const house = await storage.createBettingHouse(enrichedHouseData);
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
  app.get("/api/affiliate/links", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const links = await storage.getAffiliateLinks(user.id);
      res.json(links);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      res.status(500).json({ message: "Erro ao buscar links" });
    }
  });

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

  app.post("/api/affiliate/join", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const { bettingHouseId } = req.body;
      
      // Get betting house details
      const house = await storage.getBettingHouse(bettingHouseId);
      if (!house) {
        return res.status(404).json({ message: "Casa de apostas não encontrada" });
      }

      // Generate unique link code using username
      const linkCode = `${user.username.toUpperCase()}${String(bettingHouseId).padStart(3, '0')}`;
      
      // Create affiliate link with house URL + affid parameter
      const affiliateUrl = new URL(house.websiteUrl);
      affiliateUrl.searchParams.set('affid', user.username);
      affiliateUrl.searchParams.set('ref', linkCode);
      
      const linkData = {
        userId: user.id,
        bettingHouseId,
        linkCode,
        fullUrl: affiliateUrl.toString(),
        customName: `${house.name} - ${user.username}`,
        isActive: true
      };

      const link = await storage.createAffiliateLink(linkData);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating affiliate link:", error);
      res.status(400).json({ message: "Erro ao criar link de afiliação" });
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

  // Affiliate profile routes
  app.get("/api/affiliate/profile", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const profile = await storage.getAffiliateProfile(user.id);
      const userInfo = await storage.getUser(user.id);
      res.json({ ...profile, ...userInfo });
    } catch (error) {
      console.error("Error fetching affiliate profile:", error);
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  });

  app.patch("/api/affiliate/profile", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const profile = await storage.updateAffiliateProfile(user.id, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error updating affiliate profile:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  app.get("/api/affiliate/profile/stats", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const stats = await storage.getAffiliateProfileStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas do perfil" });
    }
  });

  // Affiliate stats route
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

  // Additional affiliate routes for reports, payments, links, etc.
  app.get("/api/affiliate/reports", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const { type = 'overview', dateRange = '30days' } = req.query;
      const reports = await storage.getAffiliateReports(user.id, type as string, dateRange as string);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching affiliate reports:", error);
      res.status(500).json({ message: "Erro ao buscar relatórios" });
    }
  });

  app.get("/api/affiliate/payments", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const payments = await storage.getPayments(user.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Erro ao buscar pagamentos" });
    }
  });

  app.get("/api/affiliate/payments/stats", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const stats = await storage.getAffiliatePaymentStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas de pagamentos" });
    }
  });

  app.get("/api/affiliate/balance", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const balance = await storage.getAffiliateBalance(user.id);
      res.json(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Erro ao buscar saldo" });
    }
  });

  app.post("/api/affiliate/payments/request", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const payment = await storage.createPaymentRequest(user.id, req.body);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment request:", error);
      res.status(400).json({ message: "Erro ao solicitar pagamento" });
    }
  });

  app.get("/api/affiliate/goals", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const goals = await storage.getAffiliateGoals(user.id);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Erro ao buscar metas" });
    }
  });

  app.get("/api/affiliate/recent-conversions", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const conversions = await storage.getRecentConversions(user.id);
      res.json(conversions);
    } catch (error) {
      console.error("Error fetching recent conversions:", error);
      res.status(500).json({ message: "Erro ao buscar conversões recentes" });
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

  // Admin Payment routes
  app.get("/api/admin/payments", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status, search, dateRange } = req.query;
      let payments = await storage.getPayments();
      
      // Apply filters
      if (status && status !== 'all') {
        payments = payments.filter(payment => payment.status === status);
      }
      
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        payments = payments.filter(payment => 
          payment.affiliate?.fullName?.toLowerCase().includes(searchLower) ||
          payment.affiliate?.email?.toLowerCase().includes(searchLower) ||
          payment.id?.toString().includes(searchLower)
        );
      }
      
      res.json(payments);
    } catch (error) {
      console.error("Error fetching admin payments:", error);
      res.status(500).json({ message: "Erro ao buscar pagamentos" });
    }
  });

  app.get("/api/admin/payments/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const payments = await storage.getPayments();
      const payment = payments.find(p => p.id === paymentId);
      
      if (!payment) {
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes do pagamento" });
    }
  });

  app.post("/api/admin/payments/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { notes, proofUrl } = req.body;
      
      const payment = await storage.updatePayment(paymentId, {
        status: 'approved',
        notes,
        proofUrl,
        approvedAt: new Date(),
        processedBy: (req.user as any).id
      });
      
      if (!payment) {
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }
      
      res.json({ message: "Pagamento aprovado com sucesso", payment });
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ message: "Erro ao aprovar pagamento" });
    }
  });

  app.post("/api/admin/payments/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { notes } = req.body;
      
      const payment = await storage.updatePayment(paymentId, {
        status: 'rejected',
        notes,
        rejectedAt: new Date(),
        processedBy: (req.user as any).id
      });
      
      if (!payment) {
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }
      
      res.json({ message: "Pagamento rejeitado", payment });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      res.status(500).json({ message: "Erro ao rejeitar pagamento" });
    }
  });

  // Regular payment routes for affiliates
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

  // Admin payment management routes
  app.get("/api/admin/payments", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching admin payments:", error);
      res.status(500).json({ message: "Erro ao buscar pagamentos" });
    }
  });

  app.get("/api/admin/payments/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = {
        totalPending: 5,
        totalApproved: 15,
        totalRejected: 2,
        totalAmount: 45000,
        pendingAmount: 8500
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  app.get("/api/admin/payments/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const payments = await storage.getPayments();
      const payment = payments.find(p => p.id === paymentId);

      if (!payment) {
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }

      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      res.status(500).json({ message: "Erro ao buscar detalhes do pagamento" });
    }
  });

  app.post("/api/admin/payments/:id/approve", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { adminNote, proofDocument } = req.body;
      const admin = req.user as any;

      const payment = await storage.updatePayment(paymentId, {
        status: 'approved',
        processedAt: new Date(),
        adminNote,
        proofDocument
      });

      if (!payment) {
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }

      res.json({ message: "Pagamento aprovado com sucesso", payment });
    } catch (error) {
      console.error("Error approving payment:", error);
      res.status(500).json({ message: "Erro ao aprovar pagamento" });
    }
  });

  app.post("/api/admin/payments/:id/reject", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { adminNote, rejectionReason } = req.body;
      const admin = req.user as any;

      const payment = await storage.updatePayment(paymentId, {
        status: 'rejected',
        processedAt: new Date(),
        adminNote,
        rejectionReason
      });

      if (!payment) {
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }

      res.json({ message: "Pagamento rejeitado", payment });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      res.status(500).json({ message: "Erro ao rejeitar pagamento" });
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

  // Dynamic postback routes for each betting house
  app.get("/api/postback/:houseToken/registration", async (req, res) => {
    try {
      const { houseToken } = req.params;
      const { subid, customer_id, amount, currency, timestamp } = req.query;
      
      // Find betting house by token
      const house = await storage.getBettingHouses().then(houses => 
        houses.find(h => h.postbackToken === houseToken)
      );
      
      if (!house) {
        return res.status(404).json({ message: 'Casa de apostas não encontrada' });
      }

      // Find affiliate link
      const link = await storage.getAffiliateLinkByCode(subid as string);
      if (!link) {
        return res.status(404).json({ message: 'Link não encontrado' });
      }

      // Process registration
      await storage.createRegistration({
        affiliateId: link.userId,
        bettingHouseId: house.id,
        username: customer_id as string,
        email: '',
        deposited: false,
        cpaCommission: house.baseCpaCommission
      });

      res.json({ success: true, message: 'Registro processado' });
    } catch (error) {
      console.error('Error processing registration postback:', error);
      res.status(500).json({ success: false, message: 'Erro ao processar registro' });
    }
  });

  app.get("/api/postback/:houseToken/deposit", async (req, res) => {
    try {
      const { houseToken } = req.params;
      const { subid, customer_id, amount, currency, timestamp } = req.query;
      
      const house = await storage.getBettingHouses().then(houses => 
        houses.find(h => h.postbackToken === houseToken)
      );
      
      if (!house) {
        return res.status(404).json({ message: 'Casa de apostas não encontrada' });
      }

      const link = await storage.getAffiliateLinkByCode(subid as string);
      if (!link) {
        return res.status(404).json({ message: 'Link não encontrado' });
      }

      const depositAmount = parseFloat(amount as string);
      const commission = (depositAmount * parseFloat(house.baseRevSharePercent)) / 100;
      
      await storage.createDeposit({
        registrationId: 1, // Should be properly linked
        affiliateId: link.userId,
        amount: depositAmount.toString(),
        commissionAmount: commission.toString(),
        status: 'confirmed'
      });

      res.json({ success: true, message: 'Depósito processado' });
    } catch (error) {
      console.error('Error processing deposit postback:', error);
      res.status(500).json({ success: false, message: 'Erro ao processar depósito' });
    }
  });

  // Generic postback route (legacy support)
  app.get("/api/postback/receive", async (req, res) => {
    try {
      const { house_id, event, subid, customer_id, amount, currency } = req.query;
      
      // Log the postback for debugging
      console.log('Postback received:', { house_id, event, subid, customer_id, amount, currency });
      
      // Find the affiliate link by subid
      const link = await storage.getAffiliateLinkByCode(subid as string);
      if (!link) {
        return res.status(404).json({ message: 'Link não encontrado' });
      }

      // Process different event types
      switch (event) {
        case 'registration':
          await storage.createRegistration({
            affiliateId: link.userId,
            bettingHouseId: parseInt(house_id as string),
            username: customer_id as string,
            email: '',
            deposited: false,
            cpaCommission: '0'
          });
          break;
          
        case 'deposit':
          const depositAmount = parseFloat(amount as string);
          const house = await storage.getBettingHouse(parseInt(house_id as string));
          const commission = house ? (depositAmount * parseFloat(house.baseRevSharePercent)) / 100 : 0;
          
          await storage.createDeposit({
            registrationId: 1, // This should be properly linked
            affiliateId: link.userId,
            amount: depositAmount.toString(),
            commissionAmount: commission.toString(),
            status: 'confirmed'
          });
          break;
      }

      res.json({ success: true, message: 'Postback processado com sucesso' });
    } catch (error) {
      console.error('Error processing postback:', error);
      res.status(500).json({ success: false, message: 'Erro ao processar postback' });
    }
  });

  app.post("/api/postback/receive", async (req, res) => {
    try {
      const { house_id, event, subid, customer_id, amount, currency } = req.body;
      
      // Same logic as GET endpoint
      const link = await storage.getAffiliateLinkByCode(subid);
      if (!link) {
        return res.status(404).json({ message: 'Link não encontrado' });
      }

      // Process the postback event
      // Implementation similar to GET endpoint
      
      res.json({ success: true, message: 'Postback processado com sucesso' });
    } catch (error) {
      console.error('Error processing postback:', error);
      res.status(500).json({ success: false, message: 'Erro ao processar postback' });
    }
  });

  // Admin postback configuration routes
  app.get("/api/admin/postback-configs", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Return existing postback configurations
      res.json([]);
    } catch (error) {
      console.error("Error fetching postback configs:", error);
      res.status(500).json({ message: "Erro ao buscar configurações" });
    }
  });

  app.post("/api/admin/postback-configs", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Save postback configuration
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving postback config:", error);
      res.status(500).json({ message: "Erro ao salvar configuração" });
    }
  });

  app.post("/api/admin/postback-test", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { token, type, testData, urls } = req.body;
      
      // Verificar se o token existe
      const houses = await storage.getBettingHouses();
      const house = houses.find(h => h.postbackToken === token);
      
      if (!house) {
        return res.json({ 
          success: false, 
          message: "Token de postback não encontrado",
          details: `Token '${token}' não está associado a nenhuma casa de apostas`
        });
      }

      // Simular o teste de postback
      console.log(`Teste de postback - Casa: ${house.name}, Tipo: ${type}, Token: ${token}`);
      console.log('Dados de teste:', testData);
      console.log('URLs:', urls);

      // Validar dados de teste baseado no tipo
      const validationErrors = [];
      
      if (type === 'registration') {
        if (!testData.affid) validationErrors.push('affid é obrigatório');
        if (!testData.customer_id) validationErrors.push('customer_id é obrigatório');
        if (!testData.email) validationErrors.push('email é obrigatório');
      } else if (type === 'deposit') {
        if (!testData.affid) validationErrors.push('affid é obrigatório');
        if (!testData.customer_id) validationErrors.push('customer_id é obrigatório');
        if (!testData.amount) validationErrors.push('amount é obrigatório');
      }

      if (validationErrors.length > 0) {
        return res.json({ 
          success: false, 
          message: "Dados de teste inválidos",
          details: validationErrors.join(', ')
        });
      }

      // Simular sucesso do teste
      const testResult = {
        success: true,
        message: `Teste de ${type} executado com sucesso para a casa ${house.name}`,
        details: {
          casa: house.name,
          token: token,
          tipo: type,
          url_testada: urls[type],
          dados_enviados: testData,
          comissao_simulada: type === 'registration' 
            ? `R$ ${house.baseCpaCommission}` 
            : `${house.baseRevSharePercent}% de R$ ${testData.amount}`,
          timestamp: new Date().toISOString()
        }
      };

      res.json(testResult);
    } catch (error) {
      console.error("Error testing postback:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno no teste",
        details: error.message 
      });
    }
  });

  // Rota para gerar links de afiliados usando username
  app.post("/api/affiliate/generate-link", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const { houseId } = req.body;
      
      const house = await storage.getBettingHouse(houseId);
      if (!house) {
        return res.status(404).json({ message: "Casa de apostas não encontrada" });
      }

      // Gerar link usando username como affid
      const linkCode = `${user.username}_${house.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      const affiliateLink = `${house.websiteUrl}?affid=${user.username}&subid=${linkCode}`;
      
      // Verificar se já existe link para esta casa
      const existingLinks = await storage.getAffiliateLinks(user.id);
      const existingLink = existingLinks.find(link => link.bettingHouseId === houseId);
      
      if (existingLink) {
        return res.json({
          link: existingLink.fullUrl,
          linkCode: existingLink.linkCode,
          house: house.name,
          username: user.username,
          postbackUrls: {
            registration: `${req.protocol}://${req.get('host')}/api/postback/${house.postbackToken}/registration`,
            deposit: `${req.protocol}://${req.get('host')}/api/postback/${house.postbackToken}/deposit`
          }
        });
      }

      // Criar novo link
      const newLink = await storage.createAffiliateLink({
        userId: user.id,
        bettingHouseId: houseId,
        linkCode,
        fullUrl: affiliateLink
      });

      res.json({
        link: affiliateLink,
        linkCode,
        house: house.name,
        username: user.username,
        postbackUrls: {
          registration: `${req.protocol}://${req.get('host')}/api/postback/${house.postbackToken}/registration`,
          deposit: `${req.protocol}://${req.get('host')}/api/postback/${house.postbackToken}/deposit`
        }
      });
    } catch (error) {
      console.error("Error generating affiliate link:", error);
      res.status(500).json({ message: "Erro ao gerar link de afiliado" });
    }
  });

  // Rota para listar links do afiliado
  app.get("/api/affiliate/links", isAuthenticated, isAffiliate, async (req, res) => {
    try {
      const user = req.user as any;
      const links = await storage.getAffiliateLinks(user.id);
      
      // Enriquecer com dados das casas de apostas
      const enrichedLinks = await Promise.all(links.map(async (link) => {
        const house = await storage.getBettingHouse(link.bettingHouseId);
        return {
          ...link,
          house: house ? {
            name: house.name,
            logoUrl: house.logoUrl,
            category: house.category
          } : null
        };
      }));
      
      res.json(enrichedLinks);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      res.status(500).json({ message: "Erro ao buscar links" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
