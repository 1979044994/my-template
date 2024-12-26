# 基础镜像
FROM  harbor.dobest.com/cicd/fed-nginx-1.18

#创建dist目录
RUN mkdir -p /www/dist

# copy代码
COPY dist/ /www/dist/

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /www

