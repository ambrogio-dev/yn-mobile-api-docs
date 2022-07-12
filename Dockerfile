# nginx state for serving content
FROM nginx:alpine
# Copy static assets over
COPY . /usr/share/nginx/html/
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Build
# docker build -t api-docs .

# Run
# docker run -d -p 80:80 api-docs

# Get into a Docker container's shell
# docker exec -it container_name sh  

# Build and run a container where the project main folder is mounted to the container */usr/share/nginx/html* folder.
# docker run --rm -v $(pwd)/:/usr/share/nginx/html -it -p 80:80 api-docs