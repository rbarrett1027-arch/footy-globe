npm install gh-pages --save-dev

import { useState, useEffect } from "react";

const LEAGUE_GROUPS = {
  "UEFA": ["CL", "EL", "EC"],
  "England": ["PL", "EL1", "FAC", "ELC"],
  "Europe": ["PD", "SA", "BL1", "FL1"],
  "World": ["WC"],
};

const LEAGUES = [
  // UEFA
  { id: "CL", name: "Champions League", country: "Europe", flag: "⭐", apiCode: "CL" },
  { id: "EL", name: "Europa League", country: "Europe", flag: "🔶", apiCode: "EL" },
  { id: "EC", name: "European Championship", country: "Europe", flag: "🌍", apiCode: "EC" },
  // England
  { id: "PL", name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", apiCode: "PL" },
  { id: "EL1", name: "Championship", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", apiCode: "ELC" },
  { id: "FAC", name: "FA Cup", country: "England", flag: "🏆", apiCode: "FAC" },
  { id: "ELC", name: "Carabao Cup", country: "England", flag: "🏆", apiCode: "ELC" },
  // Top European Leagues
  { id: "PD", name: "La Liga", country: "Spain", flag: "🇪🇸", apiCode: "PD" },
  { id: "SA", name: "Serie A", country: "Italy", flag: "🇮🇹", apiCode: "SA" },
  { id: "BL1", name: "Bundesliga", country: "Germany", flag: "🇩🇪", apiCode: "BL1" },
  { id: "FL1", name: "Ligue 1", country: "France", flag: "🇫🇷", apiCode: "FL1" },
  // World
  { id: "WC", name: "FIFA World Cup", country: "World", flag: "🌍", apiCode: "WC" },
];

const STATUS_COLORS = {
  SCHEDULED: { bg: "#1a2a1a", text: "#4ade80", label: "Upcoming" },
  LIVE: { bg: "#2a1a1a", text: "#f87171", label: "LIVE" },
  IN_PLAY: { bg: "#2a1a1a", text: "#f87171", label: "LIVE" },
  PAUSED: { bg: "#1a1a2a", text: "#60a5fa", label: "Half Time" },
  FINISHED: { bg: "#1a1a1a", text: "#9ca3af", label: "Full Time" },
  POSTPONED: { bg: "#2a1a0a", text: "#fb923c", label: "Postponed" },
  CANCELLED: { bg: "#2a1a1a", text: "#6b7280", label: "Cancelled" },
  TIMED: { bg: "#1a2a1a", text: "#4ade80", label: "Upcoming" },
};

const SAMPLE_DATA = {
  // UEFA
  CL: {
    competition: { name: "Champions League" },
    matches: [
      { id: 11, utcDate: new Date(Date.now() + 3600000 * 48).toISOString(), status: "SCHEDULED", homeTeam: { name: "Real Madrid", shortName: "RMA" }, awayTeam: { name: "Bayern Munich", shortName: "FCB" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "SEMI_FINALS" },
      { id: 12, utcDate: new Date(Date.now() + 3600000 * 72).toISOString(), status: "SCHEDULED", homeTeam: { name: "Arsenal", shortName: "ARS" }, awayTeam: { name: "PSG", shortName: "PSG" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "SEMI_FINALS" },
    ]
  },
  EL: {
    competition: { name: "Europa League" },
    matches: [
      { id: 13, utcDate: new Date(Date.now() + 3600000 * 50).toISOString(), status: "SCHEDULED", homeTeam: { name: "Man United", shortName: "MUN" }, awayTeam: { name: "Lazio", shortName: "LAZ" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "SEMI_FINALS" },
      { id: 14, utcDate: new Date(Date.now() - 86400000 * 2).toISOString(), status: "FINISHED", homeTeam: { name: "Tottenham", shortName: "TOT" }, awayTeam: { name: "Frankfurt", shortName: "SGE" }, score: { fullTime: { home: 2, away: 0 }, halfTime: { home: 1, away: 0 } }, stage: "QUARTER_FINALS" },
    ]
  },
  EC: {
    competition: { name: "European Championship" },
    matches: [
      { id: 30, utcDate: new Date(Date.now() + 3600000 * 96).toISOString(), status: "SCHEDULED", homeTeam: { name: "Germany", shortName: "GER" }, awayTeam: { name: "Spain", shortName: "ESP" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "SEMI_FINALS" },
    ]
  },
  // England
  PL: {
    competition: { name: "Premier League" },
    matches: [
      { id: 1, utcDate: new Date(Date.now() + 3600000 * 2).toISOString(), status: "SCHEDULED", homeTeam: { name: "Arsenal", shortName: "ARS" }, awayTeam: { name: "Chelsea", shortName: "CHE" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 36 },
      { id: 2, utcDate: new Date(Date.now() - 3600000).toISOString(), status: "IN_PLAY", homeTeam: { name: "Man City", shortName: "MCI" }, awayTeam: { name: "Liverpool", shortName: "LIV" }, score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } }, matchday: 36 },
      { id: 3, utcDate: new Date(Date.now() - 86400000).toISOString(), status: "FINISHED", homeTeam: { name: "Tottenham", shortName: "TOT" }, awayTeam: { name: "Man United", shortName: "MUN" }, score: { fullTime: { home: 3, away: 1 }, halfTime: { home: 2, away: 0 } }, matchday: 35 },
      { id: 4, utcDate: new Date(Date.now() + 86400000 * 3).toISOString(), status: "SCHEDULED", homeTeam: { name: "Newcastle", shortName: "NEW" }, awayTeam: { name: "Aston Villa", shortName: "AVL" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 37 },
    ]
  },
  EL1: {
    competition: { name: "Championship" },
    matches: [
      { id: 31, utcDate: new Date(Date.now() + 3600000 * 3).toISOString(), status: "SCHEDULED", homeTeam: { name: "Leeds United", shortName: "LEE" }, awayTeam: { name: "Burnley", shortName: "BUR" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 44 },
      { id: 32, utcDate: new Date(Date.now() - 3600000 * 4).toISOString(), status: "FINISHED", homeTeam: { name: "Sunderland", shortName: "SUN" }, awayTeam: { name: "Sheffield Utd", shortName: "SHU" }, score: { fullTime: { home: 1, away: 2 }, halfTime: { home: 0, away: 1 } }, matchday: 43 },
    ]
  },
  FAC: {
    competition: { name: "FA Cup" },
    matches: [
      { id: 33, utcDate: new Date(Date.now() + 3600000 * 60).toISOString(), status: "SCHEDULED", homeTeam: { name: "Man City", shortName: "MCI" }, awayTeam: { name: "Man United", shortName: "MUN" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "SEMI_FINALS" },
      { id: 34, utcDate: new Date(Date.now() + 3600000 * 84).toISOString(), status: "SCHEDULED", homeTeam: { name: "Chelsea", shortName: "CHE" }, awayTeam: { name: "Nottm Forest", shortName: "NFO" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "SEMI_FINALS" },
    ]
  },
  ELC: {
    competition: { name: "Carabao Cup" },
    matches: [
      { id: 35, utcDate: new Date(Date.now() - 86400000 * 3).toISOString(), status: "FINISHED", homeTeam: { name: "Liverpool", shortName: "LIV" }, awayTeam: { name: "Chelsea", shortName: "CHE" }, score: { fullTime: { home: 1, away: 0 }, halfTime: { home: 0, away: 0 } }, stage: "FINAL" },
    ]
  },
  // European Leagues
  PD: {
    competition: { name: "La Liga" },
    matches: [
      { id: 5, utcDate: new Date(Date.now() + 3600000 * 5).toISOString(), status: "SCHEDULED", homeTeam: { name: "Real Madrid", shortName: "RMA" }, awayTeam: { name: "Barcelona", shortName: "BAR" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 34 },
      { id: 6, utcDate: new Date(Date.now() - 7200000).toISOString(), status: "FINISHED", homeTeam: { name: "Atletico", shortName: "ATM" }, awayTeam: { name: "Sevilla", shortName: "SEV" }, score: { fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } }, matchday: 34 },
    ]
  },
  SA: {
    competition: { name: "Serie A" },
    matches: [
      { id: 7, utcDate: new Date(Date.now() + 3600000 * 8).toISOString(), status: "SCHEDULED", homeTeam: { name: "Inter Milan", shortName: "INT" }, awayTeam: { name: "AC Milan", shortName: "MIL" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 35 },
      { id: 8, utcDate: new Date(Date.now() - 3600000 * 0.5).toISOString(), status: "PAUSED", homeTeam: { name: "Juventus", shortName: "JUV" }, awayTeam: { name: "Napoli", shortName: "NAP" }, score: { fullTime: { home: 0, away: 1 }, halfTime: { home: 0, away: 1 } }, matchday: 35 },
    ]
  },
  BL1: {
    competition: { name: "Bundesliga" },
    matches: [
      { id: 9, utcDate: new Date(Date.now() + 3600000 * 24).toISOString(), status: "SCHEDULED", homeTeam: { name: "Bayern Munich", shortName: "FCB" }, awayTeam: { name: "Dortmund", shortName: "BVB" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 32 },
      { id: 21, utcDate: new Date(Date.now() - 3600000 * 26).toISOString(), status: "FINISHED", homeTeam: { name: "Leverkusen", shortName: "LEV" }, awayTeam: { name: "Leipzig", shortName: "RBL" }, score: { fullTime: { home: 2, away: 2 }, halfTime: { home: 1, away: 1 } }, matchday: 31 },
    ]
  },
  FL1: {
    competition: { name: "Ligue 1" },
    matches: [
      { id: 10, utcDate: new Date(Date.now() + 3600000 * 6).toISOString(), status: "SCHEDULED", homeTeam: { name: "PSG", shortName: "PSG" }, awayTeam: { name: "Marseille", shortName: "MAR" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, matchday: 33 },
    ]
  },
  // World
  WC: {
    competition: { name: "FIFA World Cup" },
    matches: [
      { id: 36, utcDate: new Date("2026-06-11T18:00:00Z").toISOString(), status: "SCHEDULED", homeTeam: { name: "USA", shortName: "USA" }, awayTeam: { name: "Mexico", shortName: "MEX" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "GROUP_STAGE" },
      { id: 37, utcDate: new Date("2026-06-12T21:00:00Z").toISOString(), status: "SCHEDULED", homeTeam: { name: "Brazil", shortName: "BRA" }, awayTeam: { name: "Argentina", shortName: "ARG" }, score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }, stage: "GROUP_STAGE" },
    ]
  },
};

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function MatchCard({ match }) {
  const statusInfo = STATUS_COLORS[match.status] || STATUS_COLORS.SCHEDULED;
  const isLive = match.status === "IN_PLAY" || match.status === "LIVE";
  const isPaused = match.status === "PAUSED";
  const isFinished = match.status === "FINISHED";
  const hasScore = match.score?.fullTime?.home !== null;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${isLive ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "12px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      transition: "all 0.2s",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
    >
      {isLive && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #f87171, transparent)",
          animation: "pulse 2s ease-in-out infinite"
        }} />
      )}

      {/* Status badge */}
      <div style={{
        background: statusInfo.bg,
        border: `1px solid ${statusInfo.text}33`,
        borderRadius: "6px",
        padding: "4px 10px",
        fontSize: "10px",
        fontWeight: "700",
        color: statusInfo.text,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        minWidth: "72px",
        textAlign: "center",
        flexShrink: 0,
      }}>
        {isLive && <span style={{ marginRight: "4px" }}>●</span>}
        {statusInfo.label}
      </div>

      {/* Teams + Score */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", fontFamily: "'DM Mono', monospace" }}>
            {match.homeTeam.shortName || match.homeTeam.name.substring(0, 10)}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{match.homeTeam.name}</div>
        </div>

        <div style={{ textAlign: "center", minWidth: "80px" }}>
          {hasScore ? (
            <div style={{
              fontSize: "22px", fontWeight: "800", fontFamily: "'DM Mono', monospace",
              color: isFinished ? "#94a3b8" : "#f1f5f9",
              letterSpacing: "0.1em",
            }}>
              {match.score.fullTime.home} <span style={{ color: "#334155" }}>:</span> {match.score.fullTime.away}
            </div>
          ) : (
            <div style={{ fontSize: "12px", color: "#475569" }}>{formatTime(match.utcDate)}</div>
          )}
          {isPaused && (
            <div style={{ fontSize: "10px", color: "#60a5fa", marginTop: "2px" }}>HT: {match.score.halfTime.home}–{match.score.halfTime.away}</div>
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", fontFamily: "'DM Mono', monospace" }}>
            {match.awayTeam.shortName || match.awayTeam.name.substring(0, 10)}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{match.awayTeam.name}</div>
        </div>
      </div>

      {/* Date */}
      <div style={{ fontSize: "11px", color: "#475569", textAlign: "right", flexShrink: 0 }}>
        {formatDate(match.utcDate)}
      </div>
    </div>
  );
}

function LeagueSection({ league, data, isExpanded, onToggle }) {
  const liveCount = data.matches.filter(m => m.status === "IN_PLAY" || m.status === "LIVE" || m.status === "PAUSED").length;

  return (
    <div style={{ marginBottom: "12px" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: isExpanded ? "12px 12px 0 0" : "12px", padding: "14px 20px",
          display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
          transition: "all 0.2s", color: "#f1f5f9",
        }}
      >
        <span style={{ fontSize: "22px" }}>{league.flag}</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", fontFamily: "'DM Mono', monospace" }}>{league.name}</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{league.country}</div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {liveCount > 0 && (
            <div style={{
              background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: "700", color: "#f87171"
            }}>
              ● {liveCount} LIVE
            </div>
          )}
          <div style={{
            background: "rgba(255,255,255,0.06)", borderRadius: "20px", padding: "3px 10px",
            fontSize: "11px", color: "#94a3b8"
          }}>
            {data.matches.length} matches
          </div>
          <span style={{ color: "#475569", fontSize: "16px", transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
        </div>
      </button>

      {isExpanded && (
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)", borderTop: "none",
          borderRadius: "0 0 12px 12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px",
          background: "rgba(0,0,0,0.2)"
        }}>
          {data.matches.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#475569", fontSize: "13px" }}>No matches found</div>
          ) : (
            data.matches.map(match => <MatchCard key={match.id} match={match} />)
          )}
        </div>
      )}
    </div>
  );
}

export default function SoccerTracker() {
  const [expandedLeagues, setExpandedLeagues] = useState({ PL: true, CL: true, UECL: true });
  const [filter, setFilter] = useState("all");
  const [activeGroup, setActiveGroup] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const toggleLeague = (id) => setExpandedLeagues(prev => ({ ...prev, [id]: !prev[id] }));

  const filterMatches = (matches) => {
    if (filter === "live") return matches.filter(m => m.status === "IN_PLAY" || m.status === "LIVE" || m.status === "PAUSED");
    if (filter === "today") return matches.filter(m => new Date(m.utcDate).toDateString() === new Date().toDateString());
    if (filter === "upcoming") return matches.filter(m => m.status === "SCHEDULED" || m.status === "TIMED");
    return matches;
  };

  const totalLive = Object.values(SAMPLE_DATA).reduce((acc, d) =>
    acc + d.matches.filter(m => m.status === "IN_PLAY" || m.status === "LIVE" || m.status === "PAUSED").length, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c10",
      backgroundImage: "radial-gradient(ellipse at 20% 10%, rgba(16,42,76,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(30,15,40,0.3) 0%, transparent 50%)",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: "#f1f5f9",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", boxShadow: "0 0 20px rgba(34,197,94,0.3)"
          }}>⚽</div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "800", fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em" }}>
              FOOTY<span style={{ color: "#22c55e" }}>GLOBE</span>
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>World Football Tracker</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {totalLive > 0 && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "20px", padding: "6px 14px", fontSize: "12px", fontWeight: "700", color: "#f87171",
              animation: "pulse 2s ease-in-out infinite"
            }}>
              ● {totalLive} LIVE NOW
            </div>
          )}
          <div style={{ fontSize: "11px", color: "#475569" }}>
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "8px 14px", fontSize: "12px", color: "#94a3b8", cursor: "pointer"
            }}>
            🔑 API Key
          </button>
        </div>
      </div>

      {/* API Key Banner */}
      {showKeyInput && (
        <div style={{
          background: "rgba(34,197,94,0.05)", borderBottom: "1px solid rgba(34,197,94,0.15)",
          padding: "16px 24px", display: "flex", gap: "12px", alignItems: "center"
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#4ade80" }}>Connect to football-data.org API</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Get a free API key at football-data.org to see real match data. Currently showing demo data.</div>
          </div>
          <input
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter API key..."
            style={{
              background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#f1f5f9",
              outline: "none", width: "260px",
            }}
          />
          <button style={{
            background: "#22c55e", border: "none", borderRadius: "8px",
            padding: "10px 18px", fontSize: "13px", fontWeight: "700", color: "#000", cursor: "pointer"
          }}>Save</button>
        </div>
      )}

      {/* Group tabs + match filter */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {/* League group tabs */}
        <div style={{ padding: "12px 24px 0", display: "flex", gap: "4px", overflowX: "auto" }}>
          {["All", ...Object.keys(LEAGUE_GROUPS)].map(group => (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              style={{
                background: activeGroup === group ? "rgba(34,197,94,0.15)" : "transparent",
                border: `1px solid ${activeGroup === group ? "rgba(34,197,94,0.3)" : "transparent"}`,
                borderBottom: "none", borderRadius: "8px 8px 0 0",
                padding: "8px 16px", fontSize: "12px", fontWeight: "600",
                color: activeGroup === group ? "#4ade80" : "#475569",
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap"
              }}>
              {group}
            </button>
          ))}
        </div>
        {/* Match status filter */}
        <div style={{ padding: "10px 24px", display: "flex", gap: "8px" }}>
          {[
            { id: "all", label: "All Matches" },
            { id: "live", label: `● Live (${totalLive})` },
            { id: "today", label: "Today" },
            { id: "upcoming", label: "Upcoming" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                background: filter === f.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${filter === f.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: "6px", padding: "6px 14px", fontSize: "11px", fontWeight: "600",
                color: filter === f.id ? "#cbd5e1" : "#475569", cursor: "pointer", transition: "all 0.15s"
              }}>
              {f.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: "11px", color: "#334155", display: "flex", alignItems: "center" }}>
            {Object.keys(SAMPLE_DATA).length} leagues • Demo data
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {(() => {
          const visibleLeagueIds = activeGroup === "All"
            ? LEAGUES.filter(l => SAMPLE_DATA[l.id]).map(l => l.id)
            : (LEAGUE_GROUPS[activeGroup] || []).filter(id => SAMPLE_DATA[id]);
          const visibleLeagues = LEAGUES.filter(l => visibleLeagueIds.includes(l.id));

          return visibleLeagues.map(league => {
            const data = SAMPLE_DATA[league.id];
            const filtered = { ...data, matches: filterMatches(data.matches) };
            if (filter !== "all" && filtered.matches.length === 0) return null;
            return (
              <LeagueSection
                key={league.id}
                league={league}
                data={filtered}
                isExpanded={!!expandedLeagues[league.id]}
                onToggle={() => toggleLeague(league.id)}
              />
            );
          });
        })()}
      </div>

      {/* Footer */}
      <div style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)", color: "#334155", fontSize: "11px" }}>
        FootyGlobe · All leagues available on the free football-data.org tier · {Object.keys(SAMPLE_DATA).length} competitions
      </div>
    </div>
  );
}
