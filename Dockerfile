FROM node:12

COPY . .
RUN yarn
RUN NODE_ENV=production yarn build
ENTRYPOINT [ "node","/dist/index.js" ]
