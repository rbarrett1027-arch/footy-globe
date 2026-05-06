import { useState, useEffect, useCallback } from "react";

const API_KEY = "c1b0dae3c7c844bdb71a0c633f4e4423";

const LEAGUE_GROUPS = {
  "UEFA": ["CL", "EL", "EC"],
  "England": ["PL", "EL1", "FAC", "ELC"],
  "Europe": ["PD", "SA", "BL1", "FL1"],
  "World": ["WC"],
};

const LEAGUES = [
  { id: "CL",  name: "Champions League",      country: "Europe",  flag: "⭐", apiCode: "CL"  },
  { id: "EL",  name: "Europa League",          country: "Europe",  flag: "🔶", apiCode: "EL"  },
  { id: "EC",  name: "European Championship",  country: "Europe",  flag: "🌍", apiCode: "EC"  },
  { id: "PL",  name: "Premier League",         country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", apiCode: "PL"  },
  { id: "EL1", name: "Championship",           country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", apiCode: "ELC" },
  { id: "FAC", name: "FA Cup",                 country: "England", flag: "🏆", apiCode: "FAC" },
  { id: "ELC", name: "Carabao Cup",            country: "England", flag: "🏆", apiCode: "ELC" },
  { id: "PD",  name: "La Liga",                country: "Spain",   flag: "🇪🇸", apiCode: "PD"  },
  { id: "SA",  name: "Serie A",                country: "Italy",   flag: "🇮🇹", apiCode: "SA"  },
  { id: "BL1", name: "Bundesliga",             country: "Germany", flag: "🇩🇪", apiCode: "BL1" },
  { id: "FL1", name: "Ligue 1",                country: "France",  flag: "🇫🇷", apiCode: "FL1" },
  { id: "WC",  name: "FIFA World Cup",         country: "World",   flag: "🌍", apiCode: "WC"  },
];

const STATUS_COLORS = {
  SCHEDULED: { bg: "#1a2a1a", text: "#4ade80", label: "Upcoming" },
  TIMED:     { bg: "#1a2a1a", text: "#4ade80", label: "Upcoming" },
  LIVE:      { bg: "#2a1a1a", text: "#f87171", label: "LIVE" },
  IN_PLAY:   { bg: "#2a1a1a", text: "#f87171", label: "LIVE" },
  PAUSED:    { bg: "#1a1a2a", text: "#60a5fa", label: "Half Time" },
  FINISHED:  { bg: "#1a1a1a", text: "#9ca3af", label: "Full Time" },
  POSTPONED: { bg: "#2a1a0a", text: "#fb923c", label: "Postponed" },
  CANCELLED: { bg: "#2a1a1a", text: "#6b7280", label: "Cancelled" },
};

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
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
  const hasScore = match.score?.fullTime?.home !== null && match.score?.fullTime?.home !== undefined;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${isLive ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "12px", padding: "16px 20px",
      display: "flex", alignItems: "center", gap: "16px",
      transition: "all 0.2s", position: "relative", overflow: "hidden", cursor: "default",
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
      <div style={{
        background: statusInfo.bg, border: `1px solid ${statusInfo.text}33`,
        borderRadius: "6px", padding: "4px 10px", fontSize: "10px", fontWeight: "700",
        color: statusInfo.text, letterSpacing: "0.08em", textTransform: "uppercase",
        minWidth: "72px", textAlign: "center", flexShrink: 0,
      }}>
        {isLive && <span style={{ marginRight: "4px" }}>●</span>}
        {statusInfo.label}
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", fontFamily: "'DM Mono', monospace" }}>
            {match.homeTeam.tla || match.homeTeam.shortName || match.homeTeam.name?.substring(0, 6)}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{match.homeTeam.name}</div>
        </div>

        <div style={{ textAlign: "center", minWidth: "80px" }}>
          {hasScore ? (
            <div style={{
              fontSize: "22px", fontWeight: "800", fontFamily: "'DM Mono', monospace",
              color: isFinished ? "#94a3b8" : "#f1f5f9", letterSpacing: "0.1em",
            }}>
              {match.score.fullTime.home} <span style={{ color: "#334155" }}>:</span> {match.score.fullTime.away}
            </div>
          ) : (
            <div style={{ fontSize: "12px", color: "#475569" }}>{formatTime(match.utcDate)}</div>
          )}
          {isPaused && match.score?.halfTime?.home !== null && (
            <div style={{ fontSize: "10px", color: "#60a5fa", marginTop: "2px" }}>
              HT: {match.score.halfTime.home}–{match.score.halfTime.away}
            </div>
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", fontFamily: "'DM Mono', monospace" }}>
            {match.awayTeam.tla || match.awayTeam.shortName || match.awayTeam.name?.substring(0, 6)}
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{match.awayTeam.name}</div>
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "#475569", textAlign: "right", flexShrink: 0 }}>
        {formatDate(match.utcDate)}
      </div>
    </div>
  );
}

function LeagueSection({ league, matches, isExpanded, onToggle, loading, error }) {
  const liveCount = matches.filter(m => m.status === "IN_PLAY" || m.status === "LIVE" || m.status === "PAUSED").length;

  return (
    <div style={{ marginBottom: "12px" }}>
      <button onClick={onToggle} style={{
        width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: isExpanded ? "12px 12px 0 0" : "12px", padding: "14px 20px",
        display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
        transition: "all 0.2s", color: "#f1f5f9",
      }}>
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
            }}>● {liveCount} LIVE</div>
          )}
          {loading ? (
            <div style={{ fontSize: "11px", color: "#475569" }}>Loading...</div>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: "20px", padding: "3px 10px",
              fontSize: "11px", color: "#94a3b8"
            }}>{matches.length} matches</div>
          )}
          <span style={{
            color: "#475569", fontSize: "16px",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s"
          }}>▾</span>
        </div>
      </button>

      {isExpanded && (
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)", borderTop: "none",
          borderRadius: "0 0 12px 12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px",
          background: "rgba(0,0,0,0.2)"
        }}>
          {loading && (
            <div style={{ padding: "20px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
              Fetching matches...
            </div>
          )}
          {error && (
            <div style={{ padding: "20px", textAlign: "center", color: "#fb923c", fontSize: "13px" }}>
              {error}
            </div>
          )}
          {!loading && !error && matches.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
              No matches found for this period
            </div>
          )}
          {!loading && matches.map(match => <MatchCard key={match.id} match={match} />)}
        </div>
      )}
    </div>
  );
}

export default function SoccerTracker() {
  const [matchData, setMatchData] = useState({});
  const [loadingLeagues, setLoadingLeagues] = useState({});
  const [errors, setErrors] = useState({});
  const [expandedLeagues, setExpandedLeagues] = useState({ PL: true, CL: true });
  const [filter, setFilter] = useState("all");
  const [activeGroup, setActiveGroup] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const toggleLeague = (id) => setExpandedLeagues(prev => ({ ...prev, [id]: !prev[id] }));

  const fetchLeague = useCallback(async (league) => {
    setLoadingLeagues(prev => ({ ...prev, [league.id]: true }));
    setErrors(prev => ({ ...prev, [league.id]: null }));
    try {
      const today = new Date();
      const from = new Date(today); from.setDate(today.getDate() - 3);
      const to = new Date(today); to.setDate(today.getDate() + 7);
      const fmt = d => d.toISOString().split("T")[0];

     const res = await fetch(
  `https://corsproxy.io/?https://api.football-data.org/v4/competitions/${league.apiCode}/matches?dateFrom=${fmt(from)}&dateTo=${fmt(to)}`,
        { headers: { "X-Auth-Token": API_KEY } }
      );

      if (res.status === 429) throw new Error("Rate limit hit — wait a moment and refresh");
      if (res.status === 404) throw new Error("Competition not currently active");
      if (!res.ok) throw new Error(`API error (${res.status})`);

      const data = await res.json();
      setMatchData(prev => ({ ...prev, [league.id]: data.matches || [] }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [league.id]: err.message }));
      setMatchData(prev => ({ ...prev, [league.id]: [] }));
    } finally {
      setLoadingLeagues(prev => ({ ...prev, [league.id]: false }));
    }
  }, []);

  useEffect(() => {
    LEAGUES.forEach(league => fetchLeague(league));
    setLastUpdated(new Date());
  }, [fetchLeague]);

  useEffect(() => {
    const interval = setInterval(() => {
      LEAGUES.forEach(l => fetchLeague(l));
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchLeague]);

  const filterMatches = (matches = []) => {
    if (filter === "live") return matches.filter(m => ["IN_PLAY", "LIVE", "PAUSED"].includes(m.status));
    if (filter === "today") return matches.filter(m => new Date(m.utcDate).toDateString() === new Date().toDateString());
    if (filter === "upcoming") return matches.filter(m => ["SCHEDULED", "TIMED"].includes(m.status));
    return matches;
  };

  const totalLive = Object.values(matchData).flat().filter(m =>
    ["IN_PLAY", "LIVE", "PAUSED"].includes(m.status)
  ).length;

  const visibleLeagues = activeGroup === "All"
    ? LEAGUES
    : LEAGUES.filter(l => (LEAGUE_GROUPS[activeGroup] || []).includes(l.id));

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
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px",
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
            }}>● {totalLive} LIVE NOW</div>
          )}
          <div style={{ fontSize: "11px", color: "#475569" }}>
            Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <button
            onClick={() => { LEAGUES.forEach(l => fetchLeague(l)); setLastUpdated(new Date()); }}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "8px 14px", fontSize: "12px", color: "#94a3b8", cursor: "pointer"
            }}>↻ Refresh</button>
        </div>
      </div>

      {/* Group tabs + filter */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ padding: "12px 24px 0", display: "flex", gap: "4px", overflowX: "auto" }}>
          {["All", ...Object.keys(LEAGUE_GROUPS)].map(group => (
            <button key={group} onClick={() => setActiveGroup(group)} style={{
              background: activeGroup === group ? "rgba(34,197,94,0.15)" : "transparent",
              border: `1px solid ${activeGroup === group ? "rgba(34,197,94,0.3)" : "transparent"}`,
              borderBottom: "none", borderRadius: "8px 8px 0 0",
              padding: "8px 16px", fontSize: "12px", fontWeight: "600",
              color: activeGroup === group ? "#4ade80" : "#475569",
              cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap"
            }}>{group}</button>
          ))}
        </div>
        <div style={{ padding: "10px 24px", display: "flex", gap: "8px" }}>
          {[
            { id: "all", label: "All Matches" },
            { id: "live", label: `● Live (${totalLive})` },
            { id: "today", label: "Today" },
            { id: "upcoming", label: "Upcoming" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              background: filter === f.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${filter === f.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}`,
              borderRadius: "6px", padding: "6px 14px", fontSize: "11px", fontWeight: "600",
              color: filter === f.id ? "#cbd5e1" : "#475569", cursor: "pointer", transition: "all 0.15s"
            }}>{f.label}</button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: "11px", color: "#334155", display: "flex", alignItems: "center" }}>
            {LEAGUES.length} competitions • Live data
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {visibleLeagues.map(league => {
          const matches = filterMatches(matchData[league.id] || []);
          const loading = loadingLeagues[league.id];
          const error = errors[league.id];
          if (filter !== "all" && !loading && !error && matches.length === 0) return null;
          return (
            <LeagueSection
              key={league.id}
              league={league}
              matches={matches}
              isExpanded={!!expandedLeagues[league.id]}
              onToggle={() => toggleLeague(league.id)}
              loading={loading}
              error={error}
            />
          );
        })}
      </div>

      <div style={{ padding: "24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)", color: "#334155", fontSize: "11px" }}>
        FootyGlobe · Powered by football-data.org · Refreshes every 60 seconds
      </div>
    </div>
  );
}
