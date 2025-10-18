#!/bin/bash

# VirgoHealthcare Cypress Test Runner Script
# Usage: ./run-tests.sh [smoke|regression|all] [chrome|firefox|edge] [headless|headed]

# Default values
TEST_TYPE=${1:-smoke}
BROWSER=${2:-chrome}
MODE=${3:-headless}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting VirgoHealthcare Cypress Tests${NC}"
echo -e "${YELLOW}Test Type: ${TEST_TYPE}${NC}"
echo -e "${YELLOW}Browser: ${BROWSER}${NC}"
echo -e "${YELLOW}Mode: ${MODE}${NC}"
echo ""

# Create reports directory
mkdir -p cypress/reports

# Build command based on parameters
COMMAND="npx cypress run --browser ${BROWSER}"

if [ "$MODE" = "headed" ]; then
    COMMAND="${COMMAND} --headed"
fi

if [ "$TEST_TYPE" = "smoke" ]; then
    COMMAND="${COMMAND} --spec 'cypress/e2e/smoke-tests/**/*.cy.js'"
elif [ "$TEST_TYPE" = "regression" ]; then
    COMMAND="${COMMAND} --spec 'cypress/e2e/regression-tests/**/*.cy.js'"
elif [ "$TEST_TYPE" = "all" ]; then
    COMMAND="${COMMAND} --spec 'cypress/e2e/**/*.cy.js'"
fi

COMMAND="${COMMAND} --reporter mochawesome --reporter-options 'reportDir=cypress/reports,reportFilename=${TEST_TYPE}-report.html'"

echo -e "${BLUE}📋 Executing command: ${COMMAND}${NC}"
echo ""

# Run the tests
if eval $COMMAND; then
    echo ""
    echo -e "${GREEN}✅ Tests completed successfully!${NC}"
    echo -e "${GREEN}📊 Report generated: cypress/reports/${TEST_TYPE}-report.html${NC}"
    
    # Open report in browser (macOS)
    if command -v open &> /dev/null; then
        echo -e "${BLUE}🌐 Opening report in browser...${NC}"
        open "cypress/reports/${TEST_TYPE}-report.html"
    fi
else
    echo ""
    echo -e "${RED}❌ Tests failed!${NC}"
    echo -e "${YELLOW}📸 Check screenshots in: cypress/screenshots/${NC}"
    echo -e "${YELLOW}🎥 Check videos in: cypress/videos/${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📁 Test artifacts:${NC}"
echo -e "   📊 Report: cypress/reports/${TEST_TYPE}-report.html"
echo -e "   📸 Screenshots: cypress/screenshots/"
echo -e "   🎥 Videos: cypress/videos/"
echo ""
echo -e "${GREEN}🎉 Test execution completed!${NC}"
