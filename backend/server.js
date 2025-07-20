import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { customAlphabet } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json());



// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // these options are now defaults in mongoose@7+, but harmless
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// URL Schema & Model
const urlSchema = new mongoose.Schema({
  alias: { type: String, required: true, unique: true },
  target: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
const Url = mongoose.model('Url', urlSchema);

// nanoid generator
const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6
);

// URL validation helper
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

// Create short URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { target, customAlias } = req.body;

    if (!target || !isValidUrl(target)) {
      return res.status(400).json({ error: 'Please provide a valid URL' });
    }

    let alias = customAlias;
    if (customAlias) {
      if (customAlias.length < 3 || customAlias.length > 20) {
        return res
          .status(400)
          .json({ error: 'Custom alias must be between 3 and 20 characters' });
      }
      if (await Url.exists({ alias: customAlias })) {
        return res.status(400).json({ error: 'Custom alias already exists' });
      }
    } else {
      let attempts = 0;
      // generate until unique (max 10 tries)
      do {
        alias = nanoid();
        attempts++;
        if (attempts > 10) {
          return res
            .status(500)
            .json({ error: 'Unable to generate unique alias' });
        }
      } while (await Url.exists({ alias }));
    }

    const newUrl = await Url.create({ alias, target });
    const baseUrl = process.env.BASE_URL;
    res.status(201).json({
      alias,
      target,
      shortUrl: `${baseUrl}/${alias}`,
      clicks: newUrl.clicks,
      createdAt: newUrl.createdAt,
    });
  } catch (err) {
    console.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect
app.get('/:alias', async (req, res) => {
  try {
    const { alias } = req.params;
    if (alias === 'api') return res.status(404).json({ error: 'Not found' });

    const url = await Url.findOneAndUpdate(
      { alias },
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!url) return res.status(404).json({ error: 'Short URL not found' });

    res.redirect(url.target);
  } catch (err) {
    console.error('Error redirecting:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard links
app.get('/api/links', async (_, res) => {
  try {
    const links = await Url.find()
      .select('alias target clicks createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    const baseUrl = process.env.BASE_URL;
    res.json(
      links.map((link) => ({
        ...link.toObject(),
        shortUrl: `${baseUrl}/${link.alias}`,
      }))
    );
  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stats for a single alias
app.get('/api/stats/:alias', async (req, res) => {
  try {
    const url = await Url.findOne({ alias: req.params.alias });
    if (!url) return res.status(404).json({ error: 'Short URL not found' });

    const baseUrl = process.env.BASE_URL;
    res.json({
      alias: url.alias,
      target: url.target,
      shortUrl: `${baseUrl}/${url.alias}`,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((_, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, _, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${process.env.BASE_URL}`);
});
