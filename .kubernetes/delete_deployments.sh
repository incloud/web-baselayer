#!/usr/bin/env sh

set -e

kubectl config set-credentials gitlab-deploy --token $KUBE_TOKEN
kubectl config set-context $(kubectl config current-context) --user gitlab-deploy --namespace=$KUBE_NAMESPACE

kubectl delete deployments nginx server postgres redis
