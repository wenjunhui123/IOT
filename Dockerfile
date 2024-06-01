FROM 10.12.135.233/base/nginx:v1.21.4
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
