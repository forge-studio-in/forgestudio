"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Tab = "overview" | "countdown" | "subscribers" | "contact" | "social";

interface Settings {
  launchDate: string;
  contactEmail: string;
  whatsappNumber: string;
  websiteUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
  isComingSoon: boolean;
}

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberStats, setSubscriberStats] = useState({ total: 0, active: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth check
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin");
        }
      })
      .catch(() => router.push("/admin"))
      .finally(() => setIsLoading(false));
  }, [router]);

  // Fetch settings
  const fetchSettings = useCallback(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  // Fetch subscribers
  const fetchSubscribers = useCallback(() => {
    fetch("/api/subscribers")
      .then((res) => res.json())
      .then((data) => {
        if (data.subscribers) {
          setSubscribers(data.subscribers);
          setSubscriberStats({ total: data.total, active: data.active });
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
      fetchSubscribers();
    }
  }, [isAuthenticated, fetchSettings, fetchSubscribers]);

  // Save settings
  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaveMessage("Settings saved successfully to MongoDB!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Failed to save settings");
      }
    } catch {
      setSaveMessage("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;

    try {
      await fetch("/api/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchSubscribers();
    } catch {
      alert("Failed to delete");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export.");
      return;
    }

    const headers = ["Email", "Subscribed At", "Status"];
    const rows = subscribers.map((sub) => [
      `"${sub.email}"`,
      `"${new Date(sub.subscribedAt).toLocaleString()}"`,
      `"${sub.isActive ? "Active" : "Inactive"}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `forge_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  // Countdown info
  const getCountdownInfo = () => {
    if (!settings?.launchDate) return { days: 0, label: "No date set" };
    const diff = new Date(settings.launchDate).getTime() - Date.now();
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return { days, label: days > 0 ? `${days} days remaining` : "Launch date passed" };
  };

  if (isLoading) {
    return (
      <div className="login-page">
        <div style={{ color: "#A6B8B1", fontSize: "14px" }}>Loading Dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const cdInfo = getCountdownInfo();

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "countdown",
      label: "Launch Date",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: "subscribers",
      label: "Subscribers",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "contact",
      label: "Contact Links",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      id: "social",
      label: "Social Media",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Image src="/assets/forge-admin-white-logo.png" alt="Forge Studio" width={36} height={36} style={{ objectFit: "contain", borderRadius: "6px" }} />
          <div className="admin-sidebar-logo-text">
            <span className="title">FORGE</span>
            <span className="subtitle">ADMIN DASHBOARD</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-link ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="admin-header">
              <h1>Forge Studio Admin</h1>
            </div>

            <div className="admin-stat-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-value">{subscriberStats.total}</div>
                <div className="admin-stat-label">Total Subscribers</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value">{subscriberStats.active}</div>
                <div className="admin-stat-label">Active Subscribers</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value">{cdInfo.days}</div>
                <div className="admin-stat-label">Days Until Launch</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-value">{settings?.isComingSoon ? "ACTIVE" : "OFF"}</div>
                <div className="admin-stat-label">Coming Soon Mode</div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Configured Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#A6B8B1", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Website URL</div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{settings?.websiteUrl || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#A6B8B1", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Contact Email</div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{settings?.contactEmail || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#A6B8B1", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>WhatsApp Number</div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>{settings?.whatsappNumber || "—"}</div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Recent Subscribers</h2>
              {subscribers.length === 0 ? (
                <p style={{ color: "#A6B8B1", fontSize: "14px" }}>No subscribers registered yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Subscribed Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.slice(0, 5).map((sub) => (
                      <tr key={sub._id}>
                        <td>{sub.email}</td>
                        <td>{new Date(sub.subscribedAt).toLocaleString()}</td>
                        <td style={{ color: sub.isActive ? "#0E8C6B" : "#DC2626" }}>
                          {sub.isActive ? "Active" : "Inactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* LAUNCH DATE & TIME */}
        {activeTab === "countdown" && (
          <>
            <div className="admin-header">
              <h1>Launch Date & Time Settings</h1>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className="admin-card">
                <h2>Target Launch Countdown</h2>
                <div className="admin-form-group">
                  <label htmlFor="launch-date">Launch Date & Time Picker</label>
                  <input
                    type="datetime-local"
                    id="launch-date"
                    className="admin-input"
                    value={settings?.launchDate ? new Date(settings.launchDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, launchDate: new Date(e.target.value).toISOString() } : s)}
                  />
                </div>
                <div style={{ marginTop: "16px", padding: "14px", background: "#0B0F0E", borderRadius: "8px", border: "1px solid #1E2D27" }}>
                  <span style={{ fontSize: "12px", color: "#A6B8B1", textTransform: "uppercase", letterSpacing: "1px" }}>Countdown Remaining: </span>
                  <span style={{ fontSize: "15px", color: "#0E8C6B", fontWeight: 700, marginLeft: "8px" }}>{cdInfo.label}</span>
                </div>
              </div>

              {saveMessage && (
                <div style={{ padding: "10px 16px", borderRadius: "8px", background: saveMessage.includes("success") ? "rgba(14,140,107,0.1)" : "rgba(220,38,38,0.1)", color: saveMessage.includes("success") ? "#0E8C6B" : "#DC2626", fontSize: "13px", marginBottom: "16px" }}>
                  {saveMessage}
                </div>
              )}

              <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Launch Date"}
              </button>
            </form>
          </>
        )}

        {/* SUBSCRIBERS MANAGEMENT */}
        {activeTab === "subscribers" && (
          <>
            <div className="admin-header">
              <h1>Subscribers ({subscriberStats.total})</h1>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>
                  Export CSV
                </button>
                <button className="admin-btn" style={{ background: "#1E2D27", color: "white" }} onClick={fetchSubscribers}>
                  Refresh
                </button>
              </div>
            </div>

            <div className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "16px" }}>
                <h2 style={{ margin: 0 }}>Subscriber Directory</h2>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Search subscribers by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: "320px" }}
                />
              </div>

              {filteredSubscribers.length === 0 ? (
                <p style={{ color: "#A6B8B1", fontSize: "14px" }}>No matching subscribers found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email Address</th>
                      <th>Subscribed Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub, i) => (
                      <tr key={sub._id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{sub.email}</td>
                        <td>{new Date(sub.subscribedAt).toLocaleString()}</td>
                        <td style={{ color: sub.isActive ? "#0E8C6B" : "#DC2626" }}>
                          {sub.isActive ? "Active" : "Inactive"}
                        </td>
                        <td>
                          <button className="admin-btn admin-btn-danger" style={{ padding: "4px 12px", fontSize: "11px" }} onClick={() => handleDeleteSubscriber(sub._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* CONTACT & SOCIAL LINKS */}
        {activeTab === "contact" && (
          <>
            <div className="admin-header">
              <h1>Contact Information Links</h1>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className="admin-card">
                <h2>Public Footer Contact Links</h2>
                <div className="admin-form-group">
                  <label htmlFor="website-url">Website URL (forgestudio.in)</label>
                  <input
                    type="text"
                    id="website-url"
                    className="admin-input"
                    value={settings?.websiteUrl || ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, websiteUrl: e.target.value } : s)}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="contact-email">Contact Email (hello@forgestudio.in)</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="admin-input"
                    value={settings?.contactEmail || ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, contactEmail: e.target.value } : s)}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="whatsapp-number">WhatsApp Number (+91 91489 31396)</label>
                  <input
                    type="text"
                    id="whatsapp-number"
                    className="admin-input"
                    value={settings?.whatsappNumber || ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, whatsappNumber: e.target.value } : s)}
                  />
                </div>
              </div>

              {saveMessage && (
                <div style={{ padding: "10px 16px", borderRadius: "8px", background: saveMessage.includes("success") ? "rgba(14,140,107,0.1)" : "rgba(220,38,38,0.1)", color: saveMessage.includes("success") ? "#0E8C6B" : "#DC2626", fontSize: "13px", marginBottom: "16px" }}>
                  {saveMessage}
                </div>
              )}

              <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Contact Links"}
              </button>
            </form>
          </>
        )}

        {/* SOCIAL MEDIA LINKS */}
        {activeTab === "social" && (
          <>
            <div className="admin-header">
              <h1>Social Media Links</h1>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className="admin-card">
                <h2>Public Footer Social Links</h2>
                <div className="admin-form-group">
                  <label htmlFor="social-instagram">Instagram URL</label>
                  <input
                    type="url"
                    id="social-instagram"
                    className="admin-input"
                    placeholder="https://instagram.com/forgestudio"
                    value={settings?.socialLinks?.instagram || ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, socialLinks: { ...s.socialLinks, instagram: e.target.value } } : s)}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="social-facebook">Facebook URL (replaces LinkedIn)</label>
                  <input
                    type="url"
                    id="social-facebook"
                    className="admin-input"
                    placeholder="https://facebook.com/forgestudio"
                    value={settings?.socialLinks?.facebook || ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, socialLinks: { ...s.socialLinks, facebook: e.target.value } } : s)}
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="social-youtube">YouTube URL</label>
                  <input
                    type="url"
                    id="social-youtube"
                    className="admin-input"
                    placeholder="https://youtube.com/@forgestudio"
                    value={settings?.socialLinks?.youtube || ""}
                    onChange={(e) => setSettings((s) => s ? { ...s, socialLinks: { ...s.socialLinks, youtube: e.target.value } } : s)}
                  />
                </div>
              </div>

              {saveMessage && (
                <div style={{ padding: "10px 16px", borderRadius: "8px", background: saveMessage.includes("success") ? "rgba(14,140,107,0.1)" : "rgba(220,38,38,0.1)", color: saveMessage.includes("success") ? "#0E8C6B" : "#DC2626", fontSize: "13px", marginBottom: "16px" }}>
                  {saveMessage}
                </div>
              )}

              <button type="submit" className="admin-btn admin-btn-primary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Social Links"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
