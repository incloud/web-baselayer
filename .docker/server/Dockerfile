FROM node:10.15-alpine

# Set the workdir
WORKDIR /var/app

# Needs to be here to build native npm modules
RUN apk add --no-cache --virtual .build-deps alpine-sdk python

# Add the important files
ADD lerna.json lerna.json
ADD package.json package.json
ADD packages/common/package.json packages/common/
ADD packages/server/package.json packages/server/
ADD yarn.lock yarn.lock
ADD .prettierrc .prettierrc

# Prepare everything
RUN yarn global add lerna
RUN yarn bootstrap --scope=@baselayer/server --scope=@baselayer/common
# Cleanup build files
RUN apk del .build-deps
# Copy code and build the server
ADD packages/ packages/
RUN yarn build --scope=@baselayer/server

WORKDIR /var/app/packages/server
CMD node dist/index.js
