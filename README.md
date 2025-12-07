# 📧 Temporary Email Website

Website tạo email ảo sử dụng domain **@congcumienphi.online** với ImprovMX, giống temp-mail.org.

## 🎯 Tính năng

- ✅ Tạo email ngẫu nhiên không giới hạn
- ✅ Nhận email real-time qua ImprovMX webhook
- ✅ Hiển thị inbox với danh sách email
- ✅ Xem chi tiết email (HTML/Text)
- ✅ Copy email to clipboard
- ✅ Auto-refresh inbox mỗi 5 giây
- ✅ Tự động xóa email sau 1 giờ
- ✅ Responsive design

## 🏗️ Kiến trúc

```
mail-ao/
├── backend/              # Node.js + Express API
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── config.js        # Configuration
│   ├── server.js        # Main server file
│   └── package.json
└── frontend/            # React frontend
    ├── public/
    ├── src/
    │   ├── App.js       # Main component
    │   ├── App.css      # Styles
    │   └── index.js
    └── package.json
```

## 🚀 Cài đặt & Chạy

### 1️⃣ Backend Setup

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
```

**Chỉnh sửa file `.env`:**

```env
IMPROVMX_API_KEY=your_improvmx_api_key_here
DOMAIN=congcumienphi.online
MONGO_URI=mongodb://127.0.0.1:27017/fake_mail
PORT=3001
```

**Lấy ImprovMX API Key:**
1. Đăng nhập https://improvmx.com
2. Vào **API** → **Create API Key**
3. Copy key và paste vào `.env`

**Chạy backend:**

```bash
npm start
# hoặc development mode:
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3️⃣ MongoDB Setup

**Cài đặt MongoDB:**

- Windows: https://www.mongodb.com/try/download/community
- Mac: `brew install mongodb-community`
- Linux: `sudo apt install mongodb`

**Chạy MongoDB:**

```bash
mongod
```

### 4️⃣ ImprovMX Webhook Configuration

**Để nhận email, bạn cần setup webhook:**

1. Vào https://improvmx.com
2. Chọn domain **congcumienphi.online**
3. Vào **Settings** → **Webhooks**
4. Thêm webhook URL:

```
https://your-domain.com/api/webhook/email
```

**⚠️ Lưu ý:** Webhook cần public URL. Để test local:

**Option 1: Dùng ngrok**

```bash
ngrok http 3001
# Copy URL ngrok và dùng làm webhook
```

**Option 2: Deploy lên VPS/Cloud**

Deploy backend lên server có public IP, sau đó setup webhook URL.

## 📡 API Endpoints

### 1. Tạo email mới

```
GET /api/alias/new
```

Response:
```json
{
  "success": true,
  "email": "abc123xyz@congcumienphi.online",
  "inbox": "abc123xyz"
}
```

### 2. Webhook nhận email

```
POST /api/webhook/email
```

Body (từ ImprovMX):
```json
{
  "from": "sender@gmail.com",
  "to": "abc123xyz@congcumienphi.online",
  "subject": "Test email",
  "text": "Email content",
  "html": "<b>Email content</b>"
}
```

### 3. Lấy inbox

```
GET /api/inbox/:inbox
```

Response:
```json
{
  "success": true,
  "inbox": "abc123xyz",
  "count": 2,
  "emails": [...]
}
```

### 4. Lấy chi tiết email

```
GET /api/inbox/:inbox/:emailId
```

### 5. Xóa inbox

```
DELETE /api/inbox/:inbox
```

## 🌐 Deploy Production

### Backend (Node.js)

**Option 1: Railway**

```bash
cd backend
railway login
railway init
railway up
```

**Option 2: Heroku**

```bash
heroku create your-app-name
git push heroku main
```

**Option 3: VPS (DigitalOcean, AWS, etc.)**

```bash
# Install Node.js & MongoDB trên VPS
# Clone repo
git clone your-repo
cd backend
npm install
pm2 start server.js
```

### Frontend (React)

**Option 1: Vercel**

```bash
cd frontend
vercel
```

**Option 2: Netlify**

```bash
npm run build
# Upload folder build/ lên Netlify
```

**Option 3: Tích hợp vào backend**

```bash
cd frontend
npm run build
# Copy folder build/ vào backend/public/
# Thêm vào backend/server.js:
app.use(express.static('public'));
```

## 🔧 Troubleshooting

### ❌ Lỗi: Cannot connect to MongoDB

```bash
# Check MongoDB có chạy không:
ps aux | grep mongod

# Hoặc start MongoDB:
sudo systemctl start mongod
```

### ❌ Lỗi: ImprovMX API authentication failed

- Check lại `IMPROVMX_API_KEY` trong `.env`
- Verify API key còn active trong ImprovMX dashboard

### ❌ Lỗi: CORS blocked

- Đảm bảo backend có `cors()` middleware
- Check frontend `API_URL` đúng địa chỉ backend

### ❌ Không nhận được email

1. Check webhook URL trong ImprovMX có đúng không
2. Test webhook bằng cURL:

```bash
curl -X POST http://localhost:3001/api/webhook/email \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@gmail.com",
    "to": "abc123@congcumienphi.online",
    "subject": "Test",
    "text": "Test email"
  }'
```

## 🎨 Customization

### Thay đổi domain

Sửa trong `backend/config.js`:

```js
DOMAIN: "yourdomain.com"
```

### Thay đổi thời gian tự xóa email

Sửa trong `backend/models/Email.js`:

```js
// Xóa sau 10 phút (600 giây)
EmailSchema.index({ date: 1 }, { expireAfterSeconds: 600 });
```

### Thay đổi theme/màu sắc

Sửa trong `frontend/src/App.css` hoặc `frontend/src/index.css`.

## 📝 License

MIT License - Free to use

## 🤝 Contributing

Pull requests are welcome!

## 📧 Contact

Có vấn đề? Tạo issue trên GitHub.

---

**Made with ❤️ using ImprovMX + React + Node.js + MongoDB**
