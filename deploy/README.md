# ECS 生产部署

此配置在 ECS 上直接根据源码构建 Web、Worker 和数据库迁移镜像。MySQL、Redis、对象存储分别使用阿里云 RDS、Tair 和 OSS，不在 ECS 内启动对应容器。

```bash
cp .env.prod.example .env.prod
# 编辑 .env.prod，填入域名、RDS、Tair、OSS 和 API 密钥
docker compose -f docker-compose.prod.yml config
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f web worker
```

更新代码后重新执行：

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

默认由 Nginx 容器监听 ECS 的 80 端口。HTTPS 建议在阿里云 CDN 或 ALB 上终止，并把回源地址设置为 ECS 的 80 端口。安全组只开放 80/443 和受限来源的 22；不要向公网开放 RDS 3306 或 Tair 6379。

