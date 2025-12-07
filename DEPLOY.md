# 🚀 Hướng dẫn Deploy Backend (Render) + Frontend (Vercel)

## 📦 Phần 1: Deploy Backend lên Render

### Bước 1: Tạo Git Repository

```powershell
# Trong thư mục mail-ao
git init
git add .
git commit -m "Initial commit - Temporary Email App"

# Push lên GitHub
git remote add origin https://github.com/YOUR_USERNAME/mail-ao.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy Backend lên Render

1. **Truy cập https://render.com** và đăng nhập (dùng GitHub account)

2. **Tạo Web Service mới:**
   - Click **"New +"** → **"Web Service"**
   - Connect repository: **mail-ao**
   - Name: `mail-ao-backend`
   - Region: **Singapore** (gần Việt Nam nhất)
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

3. **Environment Variables:**
   
   Thêm các biến môi trường:
   
   ```
   IMPROVMX_API_KEY=sk_3a4d93aac11842f5b62f269a67ed83ba
   DOMAIN=congcumienphi.online
   MONGO_URI=mongodb+srv://admin:admin@cluster0.gb5z4.mongodb.net/mail-ao?retryWrites=true&w=majority
   NODE_ENV=production
   PORT=3001
   ```

4. **Click "Create Web Service"**

5. **Đợi deploy** (3-5 phút). Sau khi xong, bạn sẽ có URL:
   ```
   https://mail-ao-backend.onrender.com
   ```

6. **Test backend:**
   ```
   https://mail-ao-backend.onrender.com/api/alias/new
   ```
   
   Bạn sẽ thấy JSON response tạo email mới.

### Bước 3: Cấu hình ImprovMX Webhook

1. Vào https://improvmx.com
2. Chọn domain **congcumienphi.online**
3. **Settings** → **Webhooks**
4. Thêm webhook URL:
   ```
   https://mail-ao-backend.onrender.com/api/webhook/email
   ```
5. Save

✅ Backend đã deploy xong!

---

## 🎨 Phần 2: Deploy Frontend lên Vercel

### Bước 1: Cài Vercel CLI (optional)

```powershell
npm install -g vercel
```

### Bước 2: Deploy Frontend

**Cách 1: Dùng Vercel Dashboard (Dễ nhất)**

1. **Truy cập https://vercel.com** và đăng nhập (dùng GitHub)

2. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Import repository: **mail-ao**
   - Framework: **Create React App** (auto-detect)
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables:**
   
   Thêm biến:
   ```
   REACT_APP_API_URL=https://mail-ao-backend.onrender.com/api
   ```
   
   ⚠️ **Quan trọng:** Thay `mail-ao-backend.onrender.com` bằng URL backend thực tế của bạn từ Render.

4. **Click "Deploy"**

5. **Đợi build** (2-3 phút). Sau khi xong, bạn sẽ có URL:
   ```
   https://mail-ao.vercel.app
   ```

**Cách 2: Dùng Vercel CLI**

```powershell
cd frontend
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Scope: Your account
# - Link to existing project: N
# - Project name: mail-ao-frontend
# - Directory: ./
# - Override settings: N

# Sau khi deploy xong:
vercel --prod

# Set environment variable:
vercel env add REACT_APP_API_URL
# Nhập: https://mail-ao-backend.onrender.com/api
```

✅ Frontend đã deploy xong!

---

## 🔧 Bước 3: Cập nhật CORS Backend

Backend đã được cấu hình CORS để chấp nhận requests từ Vercel.

Nếu domain Vercel khác `mail-ao.vercel.app`, cập nhật trong `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-actual-domain.vercel.app', // Thay bằng domain thực
    'https://*.vercel.app'
  ],
  credentials: true
};
```

Commit và push, Render sẽ tự động redeploy.

---

## ✅ Kiểm tra Deploy

### 1. Test Backend:
```
https://mail-ao-backend.onrender.com
```
Sẽ trả về:
```json
{
  "status": "ok",
  "message": "Temporary Email API Server",
  "timestamp": "..."
}
```

### 2. Test Generate Email:
```
https://mail-ao-backend.onrender.com/api/alias/new
```

### 3. Test Frontend:
```
https://mail-ao.vercel.app
```

### 4. Test Full Flow:
1. Mở frontend
2. Click **"Generate Email"**
3. Gửi email test đến địa chỉ vừa tạo
4. Click **"Refresh"** để xem email

---

## 🔄 Auto Deploy

### Render:
- Mỗi khi push code lên GitHub branch `main`, Render tự động rebuild backend

### Vercel:
- Mỗi khi push code lên GitHub, Vercel tự động rebuild frontend
- Preview deployments cho mọi pull request

---

## 🐛 Troubleshooting

### ❌ Backend không kết nối được MongoDB

**Giải pháp:**
- Check MongoDB Atlas whitelist IP: thêm `0.0.0.0/0` (allow all)
- Verify connection string trong Render Environment Variables

### ❌ Frontend không gọi được Backend (CORS error)

**Giải pháp:**
- Check `REACT_APP_API_URL` trong Vercel environment variables
- Verify CORS settings trong `backend/server.js`
- Redeploy frontend: `vercel --prod`

### ❌ ImprovMX webhook không hoạt động

**Giải pháp:**
- Check webhook URL trong ImprovMX có đúng không
- Test webhook trực tiếp:
  ```powershell
  curl -X POST https://mail-ao-backend.onrender.com/api/webhook/email `
    -H "Content-Type: application/json" `
    -d '{"from":"test@gmail.com","to":"test@congcumienphi.online","subject":"Test","text":"Hello"}'
  ```

### ❌ Render free tier sleep sau 15 phút không dùng

**Giải pháp:**
- Dùng cron job hoặc uptime monitor (uptimerobot.com) để ping backend mỗi 10 phút
- Upgrade lên Render paid plan ($7/month)

---

## 📊 Monitoring

### Backend Logs (Render):
- Dashboard → Service → Logs tab

### Frontend Logs (Vercel):
- Dashboard → Project → Deployments → Click deployment → Runtime Logs

---

## 💰 Chi phí

| Service | Tier | Cost |
|---------|------|------|
| Render Backend | Free | $0 |
| Vercel Frontend | Hobby | $0 |
| MongoDB Atlas | Free | $0 |
| ImprovMX | Free | $0 (100 emails/day) |
| **TOTAL** | | **$0/month** 🎉 |

---

## 🎯 Custom Domain (Optional)

### Thêm domain riêng cho frontend:

1. Vào Vercel → Project → Settings → Domains
2. Add domain: `mail.congcumienphi.online`
3. Update DNS records theo hướng dẫn Vercel
4. Vercel tự động cấp SSL certificate

### Thêm domain cho backend:

1. Vào Render → Service → Settings → Custom Domain
2. Add domain: `api.congcumienphi.online`
3. Update DNS CNAME record
4. SSL tự động

---

## 📝 URLs sau khi Deploy

```
Backend:  https://mail-ao-backend.onrender.com
Frontend: https://mail-ao.vercel.app
Webhook:  https://mail-ao-backend.onrender.com/api/webhook/email
```

**Lưu lại các URL này để cấu hình!**

---

🎉 **Hoàn thành! Website email ảo của bạn đã live!**
