FROM nginx:latest

COPY zval.html /usr/share/nginx/html

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
