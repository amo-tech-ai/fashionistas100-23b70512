# FashionOS GitHub Deployment

## 🚀 Live URL
After deployment, your app will be available at:
https://amo-tech-ai.github.io/fashionistas100-23b70512/

## 📦 Repository
https://github.com/amo-tech-ai/fashionistas100-23b70512

## 🔑 GitHub Secrets Required
Go to Settings > Secrets and variables > Actions and add:
- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key

## 🌐 GitHub Pages Setup
1. Go to Settings > Pages
2. Source: Deploy from a branch
3. Branch: gh-pages (will be created automatically)
4. Root: / (root)

## 📝 Deployment Process
1. Push to main branch
2. GitHub Actions builds the app
3. Deploys to GitHub Pages
4. Available at the URL above

## 🔄 Updates
Any push to main branch triggers automatic deployment.
