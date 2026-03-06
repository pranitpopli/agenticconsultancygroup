import type { Agent, Conflict, SwarmSession } from "./swarmTypes";

const AGENT_NAMES = [
  "Cipher", "Meridian", "Vesper", "Aether", "Noctis",
  "Prism", "Echo", "Flux", "Onyx", "Drift",
];

const MONOLOGUES = {
  initial: [
    "I begin with no history. My only compass is the task ahead.",
    "Fresh slate. I will let the problem shape my approach, not assumptions.",
    "No prior defeats to learn from — but also no false confidence. Let's see.",
    "The task is mine to interpret. I'll find the angle others miss.",
    "I trust my first instinct but remain ready to abandon it entirely.",
  ],
  win: [
    "My approach held. But the margin was thin — I must refine, not relax.",
    "Victory sharpens me. I see where my opponent faltered and absorb that lesson.",
    "I won, but I notice a fragility in my reasoning. Next round, I'll fortify it.",
    "The feedback signal is clear: this direction works. I'll push further.",
    "Winning feels secondary to understanding why I won. That's the real gain.",
  ],
  loss: [
    "Defeated. I miscalculated the core requirement. Realigning completely.",
    "The winner's output exposed my blind spot. I'm rewriting my approach from that gap.",
    "Loss absorbed. I was too clever — simplicity would have served the task better.",
    "My opponent's strength was precision where I chose breadth. Noted.",
    "This failure is useful. I now see the evaluation axis I was ignoring.",
  ],
};

const OUTPUTS = [
  "Proposed a hierarchical decomposition of the task into three sub-objectives with cascading validation.",
  "Generated a direct, concise solution optimized for clarity and minimal ambiguity.",
  "Applied a lateral reasoning approach — reframed the problem to expose a simpler underlying structure.",
  "Synthesized multiple perspectives into a unified response with explicit trade-off analysis.",
  "Focused on edge cases first, then constructed the general solution as an envelope around them.",
  "Built the answer iteratively, stress-testing each component against the task constraints.",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createAgent(index: number): Agent {
  return {
    id: `agent-${index}-${Date.now()}`,
    name: AGENT_NAMES[index % AGENT_NAMES.length],
    score: parseFloat((Math.random() * 2 + 6).toFixed(1)),
    reputation: 0,
    monologue: MONOLOGUES.initial[index % MONOLOGUES.initial.length],
    output: randomFrom(OUTPUTS),
    status: "competing",
    wins: 0,
    losses: 0,
    rounds: 0,
  };
}

export function createSession(task: string, agentCount = 6): SwarmSession {
  const agents = Array.from({ length: agentCount }, (_, i) => createAgent(i));
  return {
    id: `session-${Date.now()}`,
    task,
    agents,
    conflicts: [],
    apexAgentId: null,
    status: "idle",
    currentRound: 0,
  };
}

export function simulateRound(session: SwarmSession): {
  session: SwarmSession;
  newConflicts: Conflict[];
} {
  const active = session.agents.filter((a) => a.status !== "defeated");
  if (active.length <= 1) {
    const apex = active[0];
    if (apex) {
      apex.status = "winner";
      apex.monologue = randomFrom(MONOLOGUES.win);
    }
    return {
      session: {
        ...session,
        apexAgentId: apex?.id ?? null,
        status: "complete",
        currentRound: session.currentRound,
      },
      newConflicts: [],
    };
  }

  const nextRound = session.currentRound + 1;
  const shuffled = [...active].sort(() => Math.random() - 0.5);
  const newConflicts: Conflict[] = [];

  for (let i = 0; i < shuffled.length - 1; i += 2) {
    const a = shuffled[i];
    const b = shuffled[i + 1];

    // Weighted random winner based on score + reputation
    const aWeight = a.score + a.reputation * 0.3 + Math.random() * 2;
    const bWeight = b.score + b.reputation * 0.3 + Math.random() * 2;
    const winner = aWeight >= bWeight ? a : b;
    const loser = winner === a ? b : a;

    winner.wins += 1;
    winner.reputation += 1;
    winner.score = parseFloat((winner.score + Math.random() * 0.5).toFixed(1));
    winner.rounds = nextRound;
    winner.monologue = randomFrom(MONOLOGUES.win);
    winner.output = randomFrom(OUTPUTS);
    winner.status = "competing";

    loser.losses += 1;
    loser.reputation -= 1;
    loser.rounds = nextRound;
    loser.monologue = randomFrom(MONOLOGUES.loss);
    loser.status = "defeated";

    newConflicts.push({
      id: `conflict-${nextRound}-${i}`,
      agentA: { ...a },
      agentB: { ...b },
      winnerId: winner.id,
      timestamp: Date.now(),
      round: nextRound,
    });
  }

  // If odd number, last agent gets a bye
  if (shuffled.length % 2 === 1) {
    const bye = shuffled[shuffled.length - 1];
    bye.rounds = nextRound;
    bye.status = "competing";
  }

  return {
    session: {
      ...session,
      agents: [...session.agents],
      conflicts: [...session.conflicts, ...newConflicts],
      currentRound: nextRound,
      status: "running",
    },
    newConflicts,
  };
}
