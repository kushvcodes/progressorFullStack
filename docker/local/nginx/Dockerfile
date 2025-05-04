# syntax=docker/dockerfile:1.4
# ----------------------------
# BASE IMAGE SETUP
# ----------------------------
FROM nginx:1.21.3-alpine

# ----------------------------
# NGINX CONFIGURATION
# ----------------------------
# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configuration
COPY ./default.conf /etc/nginx/conf.d/default.conf