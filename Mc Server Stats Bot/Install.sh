#!/bin/bash

# MC Server Status Bot - One-Line Installer for Linux
# Usage: curl -sSL https://your-url.com/install.sh | bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="Gamer100309"
REPO_NAME="MC-Server-Status-Bot"
BINARY_NAME="installer-linux"

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  MC Server Status Bot - Automated Installer${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}\n"

# Detect architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64)
        BINARY_NAME="RedCity_Industries_MC_Stats_Bot_Installer_Linux_x64"
        ;;
    aarch64|arm64)
        BINARY_NAME="RedCity_Industries_MC_Stats_Bot_Installer_Linux_ARM64"
        ;;
    *)
        echo -e "${RED}❌ Unsupported architecture: $ARCH${NC}"
        echo -e "${YELLOW}Supported: x86_64, aarch64${NC}"
        exit 1
        ;;
esac

echo -e "${BLUE}Detected architecture: ${CYAN}$ARCH${NC}"

# Create temporary directory
TMP_DIR=$(mktemp -d)
INSTALLER_PATH="$TMP_DIR/$BINARY_NAME"

echo -e "${BLUE}Downloading installer...${NC}"

# Try to download from GitHub releases (latest)
DOWNLOAD_URL="https://github.com/$REPO_OWNER/$REPO_NAME/releases/latest/download/$BINARY_NAME"

if command -v wget &> /dev/null; then
    wget -q --show-progress "$DOWNLOAD_URL" -O "$INSTALLER_PATH" 2>&1 || {
        echo -e "${RED}❌ Download failed!${NC}"
        echo -e "${YELLOW}Please check:${NC}"
        echo -e "  1. GitHub repository exists"
        echo -e "  2. Release with binary exists"
        echo -e "  URL: $DOWNLOAD_URL"
        rm -rf "$TMP_DIR"
        exit 1
    }
elif command -v curl &> /dev/null; then
    curl -L --progress-bar "$DOWNLOAD_URL" -o "$INSTALLER_PATH" || {
        echo -e "${RED}❌ Download failed!${NC}"
        echo -e "${YELLOW}Please check:${NC}"
        echo -e "  1. GitHub repository exists"
        echo -e "  2. Release with binary exists"
        echo -e "  URL: $DOWNLOAD_URL"
        rm -rf "$TMP_DIR"
        exit 1
    }
else
    echo -e "${RED}❌ Neither wget nor curl found!${NC}"
    echo -e "${YELLOW}Please install wget or curl and try again.${NC}"
    rm -rf "$TMP_DIR"
    exit 1
fi

echo -e "${GREEN}✅ Download complete!${NC}\n"

# Make executable
chmod +x "$INSTALLER_PATH"

# Run installer
echo -e "${CYAN}Starting installer...${NC}\n"
"$INSTALLER_PATH"

# Cleanup
rm -rf "$TMP_DIR"

echo -e "\n${GREEN}✨ Installation script completed!${NC}"