#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
TMPPATH="$SCRIPTPATH/../tmp"

mkdir -p $TMPPATH
cd $TMPPATH

echo "A password is not needed."
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

echo "Created private and public key in $(pwd)"
echo "Base64 of private key:"
openssl base64 -in jwtRS256.key -out jwtRS256-base64.key && echo $(<jwtRS256-base64.key) | tr -d ' ' | tee jwtRS256-base64.key
echo "Base64 of public key:"
openssl base64 -in jwtRS256.key.pub -out jwtRS256-base64.key.pub && echo $(<jwtRS256-base64.key.pub) | tr -d ' ' | tee jwtRS256-base64.key.pub
