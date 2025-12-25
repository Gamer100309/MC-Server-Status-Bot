#!/bin/bash
   # MC Server Status Bot - One-Line Installer for Linux
   # Usage: curl -sSL https://raw.githubusercontent.com/Gamer100309/MC-Server-Status-Bot/main/install.sh | bash

   set -e

   # Colors
   RED='\033[0;31m'
   GREEN='\033[0;32m'
   YELLOW='\033[1;33m'
   BLUE='\033[0;34m'
   CYAN='\033[0;36m'
   NC='\033[0m'

   echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
   echo -e "${CYAN}  MC Server Status Bot - Automated Installer${NC}"
   echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
   echo ""

   # Detect architecture
   ARCH=$(uname -m)
   echo -e "${BLUE}Detected architecture: ${YELLOW}$ARCH${NC}"

   case $ARCH in
       x86_64)
           INSTALLER_URL="https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Linux_x64"
           INSTALLER_NAME="RedCity_Industries_MC_Stats_Bot_Installer_Linux_x64"
           ;;
       aarch64|arm64)
           INSTALLER_URL="https://github.com/Gamer100309/MC-Server-Status-Bot/releases/latest/download/RedCity_Industries_MC_Stats_Bot_Installer_Linux_ARM64"
           INSTALLER_NAME="RedCity_Industries_MC_Stats_Bot_Installer_Linux_ARM64"
           ;;
       *)
           echo -e "${RED}Unsupported architecture: $ARCH${NC}"
           echo -e "${YELLOW}Supported: x86_64, aarch64, arm64${NC}"
           exit 1
           ;;
   esac

   echo -e "${GREEN}Downloading installer...${NC}"
   curl -L -o "$INSTALLER_NAME" "$INSTALLER_URL"

   echo -e "${GREEN}Making installer executable...${NC}"
   chmod +x "$INSTALLER_NAME"

   echo -e "${GREEN}Running installer...${NC}"
   echo ""
   ./"$INSTALLER_NAME"

   # Cleanup
   echo ""
   echo -e "${GREEN}Cleaning up...${NC}"
   rm -f "$INSTALLER_NAME"

   echo -e "${GREEN}Installation complete!${NC}"
```

4. **Unten Commit-Message:**
```
   Fix: Convert install.sh to LF line endings
