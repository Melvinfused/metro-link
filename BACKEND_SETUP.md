# Running the Application

## For Viewing (No Server Needed)

Just run the frontend:
```bash
npm run dev
```

The site will load tiles from `public/tiles.json` and work perfectly without the backend!

## For Editing Tiles

You need BOTH servers running:

### Terminal 1 - Frontend
```bash
npm run dev
```

### Terminal 2 - Backend (for editing only)
```bash
cd server
npm start
```

When both are running:
- ⚙️ Settings icon appears
- 📝 You can edit tiles via the UI
- 💾 Changes save to `public/tiles.json`
- 📤 Commit `public/tiles.json` to deploy changes

## How It Works

**Frontend-Only Mode:**
- Loads tiles from `public/tiles.json`
- Tiles display normally
- No editing (settings icon hidden)
- Perfect for production/deployment

**Frontend + Backend Mode:**
- Backend allows editing via UI
- Changes written to `public/tiles.json`
- Commit the JSON file to save changes
- No database needed!

## Deployment

1. Make your edits (with backend running)
2. Commit `public/tiles.json` 
3. Deploy frontend-only to any static host
4. Backend not needed in production!
