FROM public.ecr.aws/docker/library/node:18-buster-slim as build
WORKDIR /var/task
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM public.ecr.aws/docker/library/node:18-buster-slim as prod
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /var/task
COPY package.json /var/task/package.json
COPY package-lock.json /var/task/package-lock.json
RUN npm install --production
COPY --from=build /var/task/.output /var/task/.output

ENV PORT=8080
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
