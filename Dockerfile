FROM node:latest
RUN mkdir -p /src/app/
WORKDIR /src/app/
ADD ./package.json .
RUN ["npm", "install"]
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
