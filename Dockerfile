FROM reg.real-ai.cn/public/node:15.6 AS build-env

COPY . .
RUN npm config set registry https://registry.npm.taobao.org/ && \
    yarn && npm run build

FROM nginx:latest
COPY --from=build-env /dist /opt/rsc1.3/fe
COPY ./nginx/nginx.conf.template /

ENV PROXY_PASS ""

CMD envsubst '$PROXY_PASS' < /nginx.conf.template > /etc/nginx/nginx.conf && \
    cat /etc/nginx/nginx.conf && nginx -g 'daemon off;'
