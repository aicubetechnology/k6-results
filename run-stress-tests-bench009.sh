#!/bin/bash

# Script to run stress tests for bench-session-009
# This script will run all the stress tests for both h100 and b200 servers
# It will capture the MongoDB stats and server health information for each test

set -e

BASE_DIR=$(pwd)
LOG_DIR="${BASE_DIR}/k6/results/bench-session-009/stress-test-logs"
mkdir -p $LOG_DIR

# Timestamp for logs
timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

# Function to capture health status
capture_health() {
  local server=$1
  local url=$2
  local output_file=$3
  
  echo "Capturing health status for $server..." | tee -a $LOG_DIR/run.log
  curl -s -X GET "${url}/health" > $output_file
  echo "Health status captured and saved to $output_file" | tee -a $LOG_DIR/run.log
}

# Function to run a test
run_test() {
  local test_name=$1
  local test_file=$2
  local wait_time=${3:-180}  # Default wait time is 180 seconds (3 minutes)
  
  echo "$(timestamp) - Starting test: $test_name" | tee -a $LOG_DIR/run.log
  k6 run $test_file &
  test_pid=$!
  
  # Wait for test to complete
  wait $test_pid || true
  
  echo "$(timestamp) - Test completed: $test_name" | tee -a $LOG_DIR/run.log
  echo "Waiting $wait_time seconds before the next test..." | tee -a $LOG_DIR/run.log
  sleep $wait_time
}

# Create the test log file
echo "====== K6 Stress Tests for Bench Session 009 ======" > $LOG_DIR/run.log
echo "Started at: $(timestamp)" >> $LOG_DIR/run.log
echo "" >> $LOG_DIR/run.log

# Check if tests are already running
if pgrep k6 > /dev/null; then
  echo "K6 is already running. Waiting for it to finish..." | tee -a $LOG_DIR/run.log
  while pgrep k6 > /dev/null; do
    sleep 10
  done
  echo "K6 has finished. Continuing with new tests..." | tee -a $LOG_DIR/run.log
  sleep 30  # Additional wait time after the previous tests
fi

# Run stress tests for h100
echo "====== Running H100 Stress Tests ======" | tee -a $LOG_DIR/run.log

# Memorize test for h100
run_test "stress-memorize-apikey-bench009-h100" "${BASE_DIR}/k6/scripts/stress-memorize-apikey-bench009-h100.js" 180

# Capture h100 health after memorize test
capture_health "h100" "http://130.61.226.26:8000" "${LOG_DIR}/h100-health-after-memorize.json"

# Admin forget test for h100
run_test "stress-admin-forget-apikey-bench009-h100" "${BASE_DIR}/k6/scripts/stress-admin-forget-apikey-bench009-h100.js" 180

# Capture h100 health after admin forget test
capture_health "h100" "http://130.61.226.26:8000" "${LOG_DIR}/h100-health-after-admin-forget.json"

# Get tenant stats test for h100
run_test "stress-get-tenant-stats-apikey-bench009-h100" "${BASE_DIR}/k6/scripts/stress-get-tenant-stats-apikey-bench009-h100.js" 180

# Capture h100 health after get tenant stats test
capture_health "h100" "http://130.61.226.26:8000" "${LOG_DIR}/h100-health-after-get-tenant-stats.json"

# Wait a bit longer before switching to b200
echo "Waiting 5 minutes before starting b200 tests..." | tee -a $LOG_DIR/run.log
sleep 300

# Run stress tests for b200
echo "====== Running B200 Stress Tests ======" | tee -a $LOG_DIR/run.log

# Memorize test for b200
run_test "stress-memorize-apikey-bench009-b200" "${BASE_DIR}/k6/scripts/stress-memorize-apikey-bench009-b200.js" 180

# Capture b200 health after memorize test
capture_health "b200" "http://150.136.65.20:8000" "${LOG_DIR}/b200-health-after-memorize.json"

# Admin forget test for b200
run_test "stress-admin-forget-apikey-bench009-b200" "${BASE_DIR}/k6/scripts/stress-admin-forget-apikey-bench009-b200.js" 180

# Capture b200 health after admin forget test
capture_health "b200" "http://150.136.65.20:8000" "${LOG_DIR}/b200-health-after-admin-forget.json"

# Get tenant stats test for b200
run_test "stress-get-tenant-stats-apikey-bench009-b200" "${BASE_DIR}/k6/scripts/stress-get-tenant-stats-apikey-bench009-b200.js" 180

# Capture b200 health after get tenant stats test
capture_health "b200" "http://150.136.65.20:8000" "${LOG_DIR}/b200-health-after-get-tenant-stats.json"

echo "$(timestamp) - All tests completed!" | tee -a $LOG_DIR/run.log
echo "Results are available in the k6/results/bench-session-009 directory." | tee -a $LOG_DIR/run.log

# Final health check
capture_health "h100" "http://130.61.226.26:8000" "${LOG_DIR}/h100-health-final.json"
capture_health "b200" "http://150.136.65.20:8000" "${LOG_DIR}/b200-health-final.json"

echo "====== End of Test Run ======" | tee -a $LOG_DIR/run.log