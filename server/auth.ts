import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Configure passport local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (identifier: string, password: string, done) => {
    try {
      // Try to find user by email first, then by CPF
      let user = await storage.getUserByEmail(identifier);
      
      if (!user) {
        // If not found by email, try to find by CPF (remove dots and dashes)
        const cleanCpf = identifier.replace(/[.\-]/g, '');
        if (cleanCpf.length === 11) {
          // Try to find user by username if it looks like a CPF
          user = await storage.getUserByUsername(cleanCpf);
        }
      }
      
      if (!user) {
        return done(null, false, { message: 'Email/CPF ou senha incorretos' });
      }

      if (!user.isActive) {
        return done(null, false, { message: 'Conta desativada' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Email/CPF ou senha incorretos' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check if user is admin
export function isAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

// Middleware to check if user is affiliate
export function isAffiliate(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === "affiliate") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

// Utility function to hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export default passport;
