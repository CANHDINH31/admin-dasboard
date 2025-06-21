# 🚀 Admin Dashboard - Deployment & Distribution Guide

## 📋 Tổng quan

Sau khi build xong, bạn có thể chia sẻ ứng dụng cho người khác sử dụng theo các cách sau:

## 🎯 Cách 1: Chia sẻ Source Code (Đơn giản nhất)

### Bước 1: Tạo Distribution Package

```bash
chmod +x package-distribution.sh
./package-distribution.sh
```

### Bước 2: Chia sẻ file

- File tạo ra: `admin-dashboard-1.0.0.tar.gz`
- Gửi file này cho người khác

### Bước 3: Người nhận sử dụng

```bash
# Giải nén
tar -xzf admin-dashboard-1.0.0.tar.gz
cd admin-dashboard-1.0.0

# Chạy deploy script
chmod +x deploy.sh
./deploy.sh
```

## 🎯 Cách 2: Deploy lên Cloud Platform

### Option A: Docker Hub

```bash
# 1. Đăng nhập Docker Hub
docker login

# 2. Build và push images
chmod +x build-and-push.sh
# Chỉnh sửa REGISTRY trong script
./build-and-push.sh

# 3. Chia sẻ docker-compose.prod.yml
```

### Option B: AWS/Google Cloud/Azure

- Sử dụng container services
- Deploy với managed databases
- Setup load balancer và domain

## 🎯 Cách 3: VPS/Server

### Bước 1: Upload files

```bash
# Upload to server
scp -r . user@your-server:/path/to/app
```

### Bước 2: SSH vào server

```bash
ssh user@your-server
cd /path/to/app
```

### Bước 3: Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Cấu hình Production

### Environment Variables

```bash
# admin-backend/.env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://mongo:27017/admin-dashboard
JWT_SECRET=your-super-secure-secret-key
JWT_EXPIRES_IN=24h
```

### Security Considerations

- ✅ Thay đổi JWT_SECRET
- ✅ Sử dụng HTTPS trong production
- ✅ Setup firewall rules
- ✅ Regular database backups
- ✅ Monitor logs và performance

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check services
docker-compose ps

# Check logs
docker-compose logs

# Check resources
docker stats
```

### Backup Database

```bash
# Create backup
docker exec -it admin-dasboard_mongo_1 mongodump --out /backup

# Copy backup from container
docker cp admin-dasboard_mongo_1:/backup ./backup
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

## 🌐 Domain & SSL Setup

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL với Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📞 Support & Troubleshooting

### Common Issues

1. **Port conflicts**: Check `netstat -tulpn`
2. **Database connection**: Check MongoDB logs
3. **Memory issues**: Monitor with `docker stats`
4. **Permission errors**: Check file permissions

### Logs Analysis

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow logs
docker-compose logs -f
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down --volumes --remove-orphans
docker system prune -a

# Start fresh
./deploy.sh
```

## 🎉 Kết luận

Với setup này, người khác có thể:

1. **Dễ dàng deploy** với một lệnh `./deploy.sh`
2. **Quản lý ứng dụng** với Docker Compose
3. **Scale và maintain** theo nhu cầu
4. **Backup và restore** dữ liệu

Chọn cách phù hợp với nhu cầu và kỹ năng của người sử dụng!
