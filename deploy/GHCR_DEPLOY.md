# GitHub Actions + GHCR 部署

## GitHub 端

推送 `production-latest` 分支后，Actions 会构建并发布四个镜像：

- `ghcr.io/wzh50056-sys/open-director-web:latest`
- `ghcr.io/wzh50056-sys/open-director-worker:latest`
- `ghcr.io/wzh50056-sys/open-director-migrate:latest`
- `ghcr.io/wzh50056-sys/open-director-nginx:latest`

在仓库的 **Actions** 页面查看构建状态，在个人主页的 **Packages** 页面查看镜像。镜像默认可能是私有的；可在每个 Package 的设置中改为 Public，或者让 ECS 使用令牌登录。

## ECS 端

ECS 只需要保存 `docker-compose.ghcr.yml` 和 `.env.prod`。私有镜像登录：

```bash
echo "GitHub_PAT" | docker login ghcr.io -u wzh50056-sys --password-stdin
```

PAT 只需要 `read:packages` 权限。随后运行：

```bash
docker compose -f docker-compose.ghcr.yml pull
docker compose -f docker-compose.ghcr.yml up -d
docker compose -f docker-compose.ghcr.yml ps
```

更新到最新镜像：

```bash
docker compose -f docker-compose.ghcr.yml pull
docker compose -f docker-compose.ghcr.yml up -d
```

如需精确回滚，把提交 SHA 作为镜像标签：

```bash
IMAGE_TAG=完整提交SHA docker compose -f docker-compose.ghcr.yml up -d
```

