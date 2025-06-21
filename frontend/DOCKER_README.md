# Docker Setup for Next.js Frontend

## Setup Environment Variables

### Backend Environment Variables

1. **Tạo file .env cho backend:**

```bash
cd admin-backend
chmod +x setup-env.sh
./setup-env.sh
```

2. **Chỉnh sửa file .env:**

```bash
# Mở file .env và cập nhật các giá trị
nano .env
```

**Các biến quan trọng cần cập nhật:**

- `JWT_SECRET`: Thay đổi thành một secret key an toàn
- `MONGODB_URI`: URL kết nối database
- `CORS_ORIGIN`: URL của frontend (mặc định: http://localhost:3000)

## Build và chạy Frontend với Docker

### Cách 1: Build và chạy riêng Frontend

1. **Build Docker image:**

```bash
cd frontend
docker build -t admin-dashboard-frontend .
```

2. **Chạy container:**

```bash
docker run -p 3000:3000 admin-dashboard-frontend
```

### Cách 2: Sử dụng script build

```bash
cd frontend
chmod +x build-docker.sh
./build-docker.sh
```

### Cách 3: Chạy toàn bộ ứng dụng với Docker Compose

Từ thư mục gốc của project:

```bash
docker-compose up --build
```

Điều này sẽ chạy:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## Các lệnh Docker hữu ích

### Xem logs

```bash
# Frontend logs
docker logs <container_id>

# Tất cả services
docker-compose logs
```

### Dừng services

```bash
docker-compose down
```

### Rebuild và restart

```bash
docker-compose up --build --force-recreate
```

### Xóa images và containers

```bash
docker-compose down --rmi all --volumes --remove-orphans
```

## Cấu hình

- **Frontend Port**: 3000
- **Backend Port**: 5000
- **Environment**: Production
- **Node.js version**: 18-alpine
- **Build optimization**: Multi-stage build với standalone output

## Environment Variables

### Backend (.env)

```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/admin-dashboard
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

## Troubleshooting

1. **Nếu build fail do dependencies:**

   - Xóa node_modules và package-lock.json
   - Chạy lại `npm install`
   - Build lại Docker image

2. **Nếu port đã được sử dụng:**

   - Thay đổi port trong docker-compose.yml
   - Hoặc dừng service đang chạy trên port đó

3. **Nếu có lỗi permission:**

   - Chạy với sudo (Linux/Mac)
   - Hoặc thêm user vào docker group

4. **Nếu backend không kết nối được database:**
   - Kiểm tra MONGODB_URI trong .env
   - Đảm bảo MongoDB container đang chạy
