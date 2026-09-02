// Memory store fallback when MongoDB instance is not connected
export const inMemoryStore = {
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@forgestudio.in",
    password: process.env.ADMIN_PASSWORD || "ForgeAdmin@2024",
    name: "Forge Admin",
  },
  settings: {
    launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    contactEmail: "hello@forgestudio.in",
    whatsappNumber: "+91 91489 31396",
    websiteUrl: "forgestudio.in",
    socialLinks: {
      instagram: "https://instagram.com/forgestudio",
      facebook: "https://facebook.com/forgestudio",
      youtube: "https://youtube.com/@forgestudio",
    },
    isComingSoon: true,
  },
  subscribers: [
    {
      _id: "sub_1",
      email: "hello.world@forgestudio.in",
      subscribedAt: new Date(Date.now() - 3600000).toISOString(),
      source: "coming-soon",
      isActive: true,
    },
    {
      _id: "sub_2",
      email: "client@forgestudio.in",
      subscribedAt: new Date(Date.now() - 86400000).toISOString(),
      source: "coming-soon",
      isActive: true,
    },
  ] as Array<{
    _id: string;
    email: string;
    subscribedAt: string;
    source: string;
    isActive: boolean;
  }>,
};
