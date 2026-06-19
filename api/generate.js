export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, role, company, skills } = req.body;

    if (!name || !role || !company || !skills) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // TEMP response (to test deployment first)
    const result = `Dear ${company},

I am ${name}, applying for ${role}. My skills include ${skills}.

Thank you.`;

    return res.status(200).json({ result });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}