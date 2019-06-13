#!/usr/bin/env sh

set -e

SERVER_SELECTOR="app=server,pipelineId=$CI_PIPELINE_ID"
TRY_INTERVAL="10s"
TRY_MAX=11

echo "Searching for Pods matching '$SERVER_SELECTOR'"

COUNTER=1
while [ "$COUNTER" -lt "$TRY_MAX" ]; do
	echo "Waiting for $TRY_INTERVAL for pod to become available, try $COUNTER"
	sleep $TRY_INTERVAL
	let COUNTER=COUNTER+1

	SERVER_POD_NAME=$(kubectl get pod -o name -l $SERVER_SELECTOR --field-selector=status.phase==Running | head -n 1 | sed -E 's/(pod|pods)\///')

	if [ -n "$SERVER_POD_NAME" ]; then
		echo "Server Pod '$SERVER_POD_NAME'"
        echo

        if [ -n "$DROP_SCHEMA" ]; then
            echo "Dropping schema..."
            kubectl exec $SERVER_POD_NAME -- yarn typeorm schema:drop
        fi

        echo "Updating schema..."
        kubectl exec $SERVER_POD_NAME -- yarn typeorm schema:sync

        if [ -n "$LOAD_FIXTURES" ]; then
            echo "Loading fixtures..."
            kubectl exec $SERVER_POD_NAME -- yarn fixtures
        fi

        exit 0
	fi
done

echo "Resources did not become ready within the retry limit!"
exit 1
