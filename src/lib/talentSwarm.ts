import type {
  SwarmSession, SwarmAgent, ProjectBrief, TalentMatch,
  SkillMatch, FinancialModel, OrgNarrative, SwarmLog,
} from "./types";
import { EMPLOYEES } from "./simulatedData";

const AGENT_DEFINITIONS: { name: string; focus: string }[] = [
  { name: "Cipher", focus: "Skills Analyst" },
  { name: "Meridian", focus: "Availability Scout" },
  { name: "Vesper", focus: "Experience Mapper" },
  { name: "Aether", focus: "Cost Optimizer" },
  { name: "Prism", focus: "Culture Fit Analyst" },
];

const MONOLOGUES = {
  scanning: [
    "Traversing the talent graph. No hierarchy to route through — I scan everyone equally.",
    "Reputation tells me where to look first. But I'll verify independently.",
    "Cross-referencing skill vectors with project requirements. The graph is dense here.",
    "Flat search across all departments. No gatekeepers, no bottlenecks.",
  ],
  analyzing: [
    "The data converges. I see a cluster of high-fit candidates the others haven't flagged yet.",
    "My peers have surfaced strong matches. I'm now modelling the gaps between them.",
    "Availability windows overlap well. This team could mobilise within the week.",
    "Cost-to-value ratio is compelling. The quorum will want to see this.",
  ],
  reporting: [
    "My contribution is filed. The swarm's collective intelligence exceeds any single view.",
    "Consensus is forming — not by vote, but by convergent evidence.",
    "The emergence gap is significant. This team configuration wouldn't surface through manual search.",
    "Reputation updated. This discovery pattern worked — I'll remember it for next time.",
  ],
};

const DISCOVERY_REASONING = [
  "Strong skill overlap with requirements. Past project experience in adjacent domain validates capability.",
  "Availability window aligns perfectly with project timeline. Skills match core technical needs.",
  "Cross-functional experience bridges the gap between required competencies. High adaptability score.",
  "Deep domain expertise combined with recent relevant project work. Availability is optimal.",
  "Unique skill combination covers multiple requirement categories simultaneously. High efficiency pick.",
  "Senior experience provides architectural oversight the team needs. Proven delivery record.",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseBrief(text: string): ProjectBrief {
  const allSkills = [
    "React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL", "Docker",
    "Kubernetes", "Machine Learning", "Design Systems", "Figma", "GraphQL",
    "Go", "Microservices", "Security", "Testing", "CI/CD", "Data Visualization",
    "NLP", "User Research", "Technical Writing", "Agile", "Project Management",
  ];

  const textLower = text.toLowerCase();
  const matched = allSkills.filter(s => textLower.includes(s.toLowerCase()));
  
  // If no skills found in text, infer some based on keywords
  if (matched.length === 0) {
    if (textLower.includes("web") || textLower.includes("app") || textLower.includes("platform")) {
      matched.push("React", "TypeScript", "Node.js");
    }
    if (textLower.includes("data") || textLower.includes("analytics") || textLower.includes("ml") || textLower.includes("ai")) {
      matched.push("Python", "Machine Learning", "Data Visualization");
    }
    if (textLower.includes("design") || textLower.includes("ux") || textLower.includes("ui")) {
      matched.push("Figma", "Design Systems", "User Research");
    }
    if (textLower.includes("cloud") || textLower.includes("infrastructure") || textLower.includes("devops")) {
      matched.push("AWS", "Docker", "Kubernetes");
    }
    if (textLower.includes("security") || textLower.includes("compliance")) {
      matched.push("Security", "Testing");
    }
    if (matched.length === 0) {
      matched.push("React", "TypeScript", "Project Management");
    }
  }

  const teamSize = textLower.includes("large") || textLower.includes("complex") ? 6 :
    textLower.includes("small") || textLower.includes("quick") ? 3 : 4;

  return {
    id: `brief-${Date.now()}`,
    title: text.length > 60 ? text.slice(0, 60) + "…" : text,
    description: text,
    requiredSkills: [...new Set(matched)],
    teamSize,
    timeline: textLower.includes("urgent") ? "2 weeks" : "4-6 weeks",
    priority: textLower.includes("urgent") || textLower.includes("critical") ? "critical" :
      textLower.includes("important") ? "high" : "medium",
  };
}

function scoreEmployee(employee: typeof EMPLOYEES[0], brief: ProjectBrief): { score: number; matches: SkillMatch[] } {
  const skillMatches: SkillMatch[] = brief.requiredSkills.map(skill => {
    const has = employee.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
    return {
      skill,
      required: true,
      matchStrength: has ? 0.7 + Math.random() * 0.3 : Math.random() * 0.2,
    };
  });

  const avgSkillMatch = skillMatches.reduce((sum, m) => sum + m.matchStrength, 0) / skillMatches.length;
  const availabilityBonus = employee.availability / 100 * 0.2;
  const experienceBonus = Math.min(employee.yearsExperience / 15, 1) * 0.15;
  
  return {
    score: Math.round((avgSkillMatch * 0.65 + availabilityBonus + experienceBonus) * 100),
    matches: skillMatches,
  };
}

function generateFinancialModel(matches: TalentMatch[], brief: ProjectBrief): FinancialModel {
  const swarmHours = matches.reduce((sum, m) => sum + (40 * 4 * (1 - m.employee.availability / 100 * 0.3)), 0);
  const swarmCost = matches.reduce((sum, m) => sum + m.employee.hourlyRate * 160, 0);
  const traditionalCost = swarmCost * (1.4 + Math.random() * 0.3);
  const savingsPercent = Math.round((1 - swarmCost / traditionalCost) * 100);

  return {
    traditionalCost: Math.round(traditionalCost),
    swarmCost: Math.round(swarmCost),
    savingsPercent,
    timeToAssembleTraditional: 12 + Math.round(Math.random() * 8),
    timeToAssembleSwarm: 1 + Math.round(Math.random() * 2),
    utilisationImprovement: 15 + Math.round(Math.random() * 25),
    breakdown: [
      { label: "Talent Search", traditional: Math.round(traditionalCost * 0.15), swarm: Math.round(swarmCost * 0.02) },
      { label: "Interviews & Vetting", traditional: Math.round(traditionalCost * 0.12), swarm: Math.round(swarmCost * 0.03) },
      { label: "Team Assembly", traditional: Math.round(traditionalCost * 0.08), swarm: Math.round(swarmCost * 0.01) },
      { label: "Delivery Cost", traditional: Math.round(traditionalCost * 0.65), swarm: Math.round(swarmCost * 0.94) },
    ],
  };
}

function generateNarrative(matches: TalentMatch[], brief: ProjectBrief, financial: FinancialModel): OrgNarrative {
  return {
    title: "From Hierarchical Routing to Dynamic Assembly",
    body: `This team configuration was assembled by a swarm of ${AGENT_DEFINITIONS.length} AI agents operating without hierarchy or central coordination. Each agent independently traversed the organisation's talent graph, surfacing candidates through parallel skill matching, availability analysis, and experience mapping. The resulting team of ${matches.length} individuals spans ${new Set(matches.map(m => m.employee.department)).size} departments and ${new Set(matches.map(m => m.employee.location)).size} locations — a configuration that would require multiple manager consultations and weeks of coordination through traditional channels. The AI augments human judgment by exposing connections invisible to any single manager's network. No roles were replaced; the routing was replaced.`,
    keyInsights: [
      `${financial.savingsPercent}% cost reduction versus traditional resourcing, primarily from eliminating search and coordination overhead.`,
      `Assembly time reduced from ~${financial.timeToAssembleTraditional} days to ${financial.timeToAssembleSwarm} day${financial.timeToAssembleSwarm > 1 ? "s" : ""} — a ${Math.round(financial.timeToAssembleTraditional / financial.timeToAssembleSwarm)}× improvement.`,
      `Cross-departmental team formation occurred without any hierarchical approval chain — the swarm's quorum-based consensus replaced the manager.`,
      `${financial.utilisationImprovement}% utilisation improvement by matching partially-available talent across time zones rather than seeking single full-time allocations.`,
    ],
  };
}

export function createSession(taskText: string): SwarmSession {
  const brief = parseBrief(taskText);
  const agents: SwarmAgent[] = AGENT_DEFINITIONS.map((def, i) => ({
    id: `agent-${i}-${Date.now()}`,
    name: def.name,
    focus: def.focus,
    status: "idle",
    monologue: "Awaiting activation. Ready to traverse the talent graph.",
    reputation: Math.floor(Math.random() * 5),
    discoveryCount: 0,
    currentAction: "",
  }));

  return {
    id: `session-${Date.now()}`,
    brief,
    agents,
    discoveries: [],
    financialModel: null,
    narrative: null,
    status: "idle",
    currentPhase: "Initializing",
    progress: 0,
    logs: [],
  };
}

export function simulateStep(session: SwarmSession): SwarmSession {
  const s = { ...session, agents: session.agents.map(a => ({ ...a })), discoveries: [...session.discoveries], logs: [...session.logs] };

  if (s.progress < 30) {
    // Phase 1: Scanning
    s.status = "discovering";
    s.currentPhase = "Talent Discovery";
    s.agents.forEach(a => {
      a.status = "scanning";
      a.monologue = randomFrom(MONOLOGUES.scanning);
      a.currentAction = `Scanning ${randomFrom(["Engineering", "Design", "Data", "Infrastructure", "Product"])} department`;
    });

    // Discover 1-2 employees per step
    const unmatched = EMPLOYEES.filter(e => !s.discoveries.some(d => d.employee.id === e.id));
    const toDiscover = unmatched.slice(0, 1 + Math.floor(Math.random() * 2));
    
    toDiscover.forEach(emp => {
      const { score, matches } = scoreEmployee(emp, s.brief);
      if (score > 30) {
        const agent = randomFrom(s.agents);
        s.discoveries.push({
          employee: emp,
          matchScore: score,
          skillMatches: matches,
          reasoning: randomFrom(DISCOVERY_REASONING),
          discoveredBy: agent.name,
        });
        agent.discoveryCount += 1;
        s.logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          agentName: agent.name,
          message: `Discovered ${emp.name} (${emp.role}) — ${score}% match`,
          type: "discovery",
        });
      }
    });

    s.progress = Math.min(s.progress + 8 + Math.random() * 7, 30);

  } else if (s.progress < 65) {
    // Phase 2: Analyzing
    s.currentPhase = "Business Value Analysis";
    s.agents.forEach(a => {
      a.status = "analyzing";
      a.monologue = randomFrom(MONOLOGUES.analyzing);
      a.currentAction = `Modeling ${randomFrom(["cost optimization", "availability windows", "skill coverage", "team synergy"])}`;
    });

    // Continue discovering stragglers
    const unmatched = EMPLOYEES.filter(e => !s.discoveries.some(d => d.employee.id === e.id));
    if (unmatched.length > 0) {
      const emp = unmatched[0];
      const { score, matches } = scoreEmployee(emp, s.brief);
      const agent = randomFrom(s.agents);
      s.discoveries.push({
        employee: emp, matchScore: score, skillMatches: matches,
        reasoning: randomFrom(DISCOVERY_REASONING), discoveredBy: agent.name,
      });
      s.logs.push({
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(), agentName: agent.name,
        message: `Late discovery: ${emp.name} — ${score}% match via cross-reference`,
        type: "discovery",
      });
    }

    // Add analysis logs
    s.logs.push({
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      agentName: randomFrom(s.agents).name,
      message: randomFrom([
        "Financial model converging. Cost advantage is clear.",
        "Skill coverage matrix shows 94% overlap with requirements.",
        "Cross-timezone availability creates near-continuous coverage.",
        "Quorum forming around top candidates. Consensus emerging.",
      ]),
      type: "analysis",
    });

    s.progress = Math.min(s.progress + 10 + Math.random() * 8, 65);

  } else if (s.progress < 90) {
    // Phase 3: Building financial model and narrative
    s.currentPhase = "Synthesizing Results";
    s.agents.forEach(a => {
      a.status = "reporting";
      a.monologue = randomFrom(MONOLOGUES.reporting);
      a.currentAction = "Filing final assessment";
    });

    // Sort and trim to team size
    s.discoveries.sort((a, b) => b.matchScore - a.matchScore);
    const topTeam = s.discoveries.slice(0, s.brief.teamSize);

    if (!s.financialModel) {
      s.financialModel = generateFinancialModel(topTeam, s.brief);
      s.logs.push({
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(), agentName: "Aether",
        message: `Financial model complete: ${s.financialModel.savingsPercent}% savings projected`,
        type: "insight",
      });
    }

    if (!s.narrative) {
      s.narrative = generateNarrative(topTeam, s.brief, s.financialModel);
      s.logs.push({
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(), agentName: "Prism",
        message: "Organisational shift narrative generated. The why is documented.",
        type: "insight",
      });
    }

    s.progress = Math.min(s.progress + 12 + Math.random() * 8, 90);

  } else {
    // Phase 4: Complete
    s.status = "complete";
    s.currentPhase = "Assembly Complete";
    s.progress = 100;
    s.agents.forEach(a => {
      a.status = "complete";
      a.currentAction = "";
    });
    s.discoveries.sort((a, b) => b.matchScore - a.matchScore);

    s.logs.push({
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(), agentName: "Swarm",
      message: `Team assembled: ${s.brief.teamSize} members from ${new Set(s.discoveries.slice(0, s.brief.teamSize).map(d => d.employee.department)).size} departments`,
      type: "consensus",
    });
  }

  return s;
}
