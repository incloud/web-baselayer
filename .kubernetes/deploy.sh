#!/usr/bin/env sh

set -e

kubectl config set-credentials gitlab-deploy --token $KUBE_TOKEN
kubectl config set-context $(kubectl config current-context) --user gitlab-deploy --namespace=$KUBE_NAMESPACE

gomplate < .kubernetes/nginx/deployment.yaml | kubectl apply -f -
gomplate < .kubernetes/nginx/ingress.yaml | kubectl apply -f -
gomplate < .kubernetes/nginx/service.yaml | kubectl apply -f -

gomplate < .kubernetes/postgres/configmap.yaml | kubectl apply -f -
gomplate < .kubernetes/postgres/deployment.yaml | kubectl apply -f -
gomplate < .kubernetes/postgres/secret.yaml | kubectl apply -f -
gomplate < .kubernetes/postgres/service.yaml | kubectl apply -f -
gomplate < .kubernetes/postgres/storage.yaml | kubectl apply -f -

gomplate < .kubernetes/redis/deployment.yaml | kubectl apply -f -
gomplate < .kubernetes/redis/service.yaml | kubectl apply -f -
gomplate < .kubernetes/redis/storage.yaml | kubectl apply -f -

gomplate < .kubernetes/server/configmap.yaml | kubectl apply -f -
gomplate < .kubernetes/server/deployment.yaml | kubectl apply -f -
gomplate < .kubernetes/server/secret.yaml | kubectl apply -f -
gomplate < .kubernetes/server/service.yaml | kubectl apply -f -

gomplate < .kubernetes/shared/configmap.yaml | kubectl apply -f -
gomplate < .kubernetes/shared/secret.yaml | kubectl apply -f -
