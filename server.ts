import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";

import { INITIAL_ARTICLES } from "./src/data/articles";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "prosper-secret-key-2024";
const ADMIN_EMAIL = "admin@prosper.org";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory store for demo
  let articles = [...INITIAL_ARTICLES];

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.get("/api/articles", (req, res) => {
    res.json(articles);
  });

  app.post("/api/articles", authenticateToken, (req, res) => {
    const newArticle = { ...req.body, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    articles.push(newArticle);
    res.status(201).json(newArticle);
  });

  app.put("/api/articles/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ message: "Article not found" });
    articles[index] = { ...articles[index], ...req.body };
    res.json(articles[index]);
  });

  app.delete("/api/articles/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    console.log(`Deleting article with id: ${id}`);
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles.splice(index, 1);
      console.log(`Article deleted. Remaining: ${articles.length}`);
      res.sendStatus(204);
    } else {
      console.log(`Article with id ${id} not found`);
      res.status(404).json({ message: "Article not found" });
    }
  });

  app.post("/api/articles/:id/comments", (req, res) => {
    const { id } = req.params;
    const { author, text } = req.body;
    const article = articles.find(a => a.id === id);
    if (article) {
      const newComment = {
        id: Math.random().toString(36).substr(2, 9),
        author: author || 'Guest Parent',
        text,
        createdAt: new Date().toISOString()
      };
      article.comments.unshift(newComment);
      res.status(201).json(newComment);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  });

  app.post("/api/articles/:id/vote", (req, res) => {
    const { id } = req.params;
    const { optionIndex } = req.body;
    const article = articles.find(a => a.id === id);
    if (article && article.poll && article.poll.options[optionIndex]) {
      article.poll.options[optionIndex].votes += 1;
      res.json(article.poll);
    } else {
      res.status(404).json({ message: 'Article or option not found' });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Delete a comment
  app.delete("/api/articles/:articleId/comments/:commentId", authenticateToken, (req, res) => {
    const { articleId, commentId } = req.params;
    console.log(`Admin ${req.user.email} is deleting comment ${commentId} from article ${articleId}`);
    const article = articles.find(a => a.id === articleId);
    if (!article) return res.status(404).json({ error: "Article not found" });
    
    const originalCount = article.comments.length;
    article.comments = article.comments.filter(c => c.id !== commentId);
    const deletedCount = originalCount - article.comments.length;
    
    console.log(`Deleted ${deletedCount} comment(s).`);
    res.json({ success: true, deletedCount });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
