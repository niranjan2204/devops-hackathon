import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';
import { signToken, verifyToken } from './lib/auth';

const router = Router();

// --- Auth Routes ---
router.post('/login', async (req, res) => {
  try {
    const { email: rawEmail, password: rawPassword } = req.body;
    console.log("LOGIN ATTEMPT:", req.body);
    const email = rawEmail?.trim().toLowerCase();
    const password = rawPassword?.trim();
    if (!email || !password) return res.status(400).json({ error: "Email and Password are required." });

    const leader = await prisma.teamMember.findUnique({
      where: { email },
      include: { team: true }
    });

    if (!leader || !leader.isLeader || !leader.team) {
      console.log("LOGIN FAIL: Leader not found, or not leader, or no team", { leader });
      return res.status(401).json({ error: "Invalid Email or Password." });
    }

    const team = leader.team;
    if (team.status === "PENDING") {
      return res.status(403).json({ error: "Your team is pending Admin approval." });
    }

    const passwordMatch = await bcrypt.compare(password, team.passwordHash);
    console.log("PASSWORD MATCH?", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Email or Password." });
    }

    const token = signToken({ teamId: team.id, role: 'team_leader' });

    res.json({ success: true, token, teamId: team.teamId });
  } catch (error: any) {
    res.status(500).json({ error: "An error occurred during login." });
  }
});

router.post('/register', async (req, res) => {
  try {
    const data = req.body;
    const { teamName, password, leader, members } = data;
    
    const allMembers = [leader, ...(members || [])].filter(m => m && m.name && m.email);

    if (!teamName || !password || allMembers.length < 2 || allMembers.length > 3) {
      return res.status(400).json({ error: "Invalid team data. Must have 2 to 3 members." });
    }

    const existingTeam = await prisma.team.findUnique({ where: { teamName } });
    if (existingTeam) return res.status(400).json({ error: "Team name already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const teamIdStr = "DVH-" + Math.floor(1000 + Math.random() * 9000).toString();

    const team = await prisma.team.create({
      data: {
        teamId: teamIdStr,
        teamName,
        passwordHash,
        plainPassword: password,
        members: {
          create: allMembers.map((m: any, idx: number) => ({
            name: m.name,
            registerNumber: m.registerNumber,
            email: m.email.toLowerCase(),
            phone: m.phone || null,
            isLeader: idx === 0
          }))
        }
      },
      include: { members: true }
    });

    res.json({ success: true, team });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: "Email or Register Number already used." });
    res.status(500).json({ error: error.message });
  }
});

// --- Config Route ---
router.get('/config', async (req, res) => {
  try {
    let config = await prisma.hackathonConfig.findUnique({ where: { id: "default" } });
    if (!config) {
      config = await prisma.hackathonConfig.create({ data: { id: "default" } });
    }
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch config" });
  }
});

// --- Problems Routes ---
router.post('/problems', async (req, res) => {
  try {
    const token = req.cookies.hackathon_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = verifyToken(token) as any;
    if (!payload || !payload.teamId) return res.status(401).json({ error: "Invalid token" });

    const { problemId } = req.body;
    if (!problemId) return res.status(400).json({ error: "Missing problem ID" });

    const existingSelection = await prisma.problemSelection.findUnique({ where: { teamId: payload.teamId } });
    if (existingSelection) return res.status(400).json({ error: "Team has already selected a problem" });

    const problem = await prisma.problemStatement.findUnique({ where: { id: problemId } });
    if (!problem || problem.status !== "AVAILABLE") {
      return res.status(400).json({ error: "Problem is no longer available" });
    }

    await prisma.$transaction([
      prisma.problemStatement.update({
        where: { id: problemId },
        data: { status: "SELECTED" }
      }),
      prisma.problemSelection.create({
        data: {
          teamId: payload.teamId,
          problemStatementId: problemId
        }
      })
    ]);

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/problems', async (req, res) => {
  try {
    let config = await prisma.hackathonConfig.findUnique({ where: { id: "default" } });
    const now = new Date();
    
    // Lock if selectionStart is set and hasn't started yet
    const locked = config?.selectionStart ? now < config.selectionStart : false;
    
    const problems = locked ? [] : await prisma.problemStatement.findMany({ where: { status: "AVAILABLE" } });
    res.json({ locked, problems });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

// --- Admin Routes ---
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bitsathy.ac.in";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const token = signToken({ id: "admin", role: "admin", teamId: "admin" });

    res.json({ success: true, token });
  } catch (error: any) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

router.post('/admin/problems', async (req, res) => {
  try {
    const { title, description, domain, difficulty } = req.body;
    if (!title || !description || !domain || !difficulty) return res.status(400).json({ error: "Missing required fields" });
    
    const problem = await prisma.problemStatement.create({ data: { title, description, domain, difficulty } });
    res.json({ success: true, problem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/admin/problems', async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: "Missing problem ID" });
    
    const { title, description, domain, difficulty } = req.body;
    const problem = await prisma.problemStatement.update({
      where: { id },
      data: { title, description, domain, difficulty }
    });
    res.json({ success: true, problem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/problems', async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: "Missing problem ID" });
    await prisma.problemStatement.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/teams', async (req, res) => {
  try {
    const teams = await prisma.team.findMany({ include: { members: true }, orderBy: { registeredAt: 'desc' } });
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/admin/teams', async (req, res) => {
  try {
    const id = req.query.id as string || req.body.teamId;
    if (!id) return res.status(400).json({ error: "Team ID is required" });
    const { status } = req.body;
    const team = await prisma.team.update({ where: { id }, data: { status } });
    res.json({ success: true, team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/teams', async (req, res) => {
  try {
    const id = req.query.id as string || req.body.teamId;
    if (!id) return res.status(400).json({ error: "Team ID is required" });
    
    // Delete team members and problem selection first due to relations
    await prisma.teamMember.deleteMany({ where: { teamId: id } });
    await prisma.problemSelection.deleteMany({ where: { teamId: id } });
    
    await prisma.team.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/settings', async (req, res) => {
  try {
    let config = await prisma.hackathonConfig.findUnique({ where: { id: "default" } });
    if (!config) config = await prisma.hackathonConfig.create({ data: { id: "default" } });
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/admin/settings', async (req, res) => {
  try {
    const data = req.body;
    // ensure date conversion
    const updateData = { ...data };
    const dateFields = ['registrationStart', 'registrationEnd', 'hackathonStart', 'hackathonEnd', 'selectionStart', 'selectionEnd'];
    dateFields.forEach(field => { if (updateData[field]) updateData[field] = new Date(updateData[field]); });
    
    const config = await prisma.hackathonConfig.upsert({
      where: { id: "default" },
      update: updateData,
      create: { id: "default", ...updateData }
    });
    res.json({ success: true, config });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/stats', async (req, res) => {
  try {
    const totalTeams = await prisma.team.count();
    let config = await prisma.hackathonConfig.findUnique({ where: { id: "default" } });
    const maxTeams = config?.maxTeams || 50;
    
    const totalProblems = await prisma.problemStatement.count();
    const selectedProblems = await prisma.problemSelection.count();
    const problems = await prisma.problemStatement.findMany();
    
    res.json({ totalTeams, maxTeams, totalProblems, selectedProblems, problems });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
        problemSelection: {
          include: {
            problemStatement: true
          }
        }
      }
    });
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
