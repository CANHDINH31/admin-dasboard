# Admin Dashboard - Deployment Guide

## 🚀 Quick Start

### Prerequisites

- Docker và Docker Compose đã cài đặt
- Port 3000, 5000, 27017 available

### 1. Setup Environment Variables

```bash
cd admin-backend
cp env.example .env
# Chỉnh sửa file .env với các giá trị phù hợp
```

### 2. Chạy ứng dụng

```bash
# Development
docker-compose up --build

# Production (nếu có images từ registry)
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

## 📋 Cấu hình

### Environment Variables (admin-backend/.env)

```bash
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/admin-dashboard
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Ports

- Frontend: 3000
- Backend: 5000
- MongoDB: 27017

## 🔧 Management Commands

### Start/Stop

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Restart
docker-compose restart
```

### Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### Database

```bash
# Backup
docker exec -it admin-dasboard_mongo_1 mongodump --out /backup

# Restore
docker exec -it admin-dasboard_mongo_1 mongorestore /backup
```

## 🐛 Troubleshooting

### Port conflicts

```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
```

### Database connection issues

```bash
# Check MongoDB logs
docker-compose logs mongo

# Connect to MongoDB
docker exec -it admin-dasboard_mongo_1 mongosh
```

### Reset everything

```bash
docker-compose down --volumes --remove-orphans
docker system prune -a
```

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:

1. Docker và Docker Compose version
2. Port availability
3. Environment variables
4. Logs của các services
