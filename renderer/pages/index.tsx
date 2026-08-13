// renderer/pages/index.tsx
import React, { useState } from "react";
import dynamic from "next/dynamic";
import GlobalExitCountrySelector from "../components/GlobalExitCountrySelector";
import {
  Box,
  Stack,
  useColorModeValue,
  Flex,
  Grid,
  GridItem,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useAppContext } from "../context/AppProvider";
import { motion } from "framer-motion"; // Import framer-motion

const AnimatedButton = dynamic(() => import("../components/AnimatedButton"), {
  ssr: false,
});

const IPCard = dynamic(() => import("../components/IPCard"), {
  ssr: false,
});

const ProxyStatus = dynamic(() => import("../components/ProxyStatus"), {
  ssr: false,
});

const GlobeComponent = dynamic(
  () => import("../components/Globe/GlobeComponent"),
  {
    ssr: false,
  }
);

const CircuitPathView = dynamic(
  () => import("../components/CircuitPathView"),
  { ssr: false }
);

const RulesPanel = dynamic(
  () => import("../components/RulesPanel"),
  { ssr: false }
);

const ActivityPanel = dynamic(
  () => import("../components/ActivityPanel"),
  { ssr: false }
);

const ConnectionSidebar = dynamic(
  () => import("../components/ConnectionSidebar"),
  { ssr: false }
);

function ExpandedHomePage() {
  const {
    appBooted,
    realIP,
    proxyIP,
    realLocation,
    proxyLocation,
    relayLocation,
    proxyRunning,
    isLoading,
    groupedProcesses,
    connectionTime,
    handleStartProxy,
    handleStopProxy,
    screenSize,
    numberOfRelays,
    showAnimations,
    globalExitCountry,
    setGlobalExitCountry,
    circuitHopCountries,
    circuitHopCoordinates,
  } = useAppContext();

  const bgColor = useColorModeValue("gray.100", "#18181B");
  const cardBgColor = useColorModeValue("white", "#18181B");
  const headerBgColor = useColorModeValue("teal.500", "#131315");
  const headerTextColor = useColorModeValue("black", "white");
  const ipcCardText = useColorModeValue("teal.500", "#27D7F2");
  const menuTextColor = useColorModeValue("black", "white");

  const mainContainerBgColor = useColorModeValue(
    "radial-gradient(164.53% 66.45% at 0% 100%, rgb(87 224 245 / 33%) 0%, rgb(0 0 0 / 13%) 100%), rgb(255 255 255 / 33%)",

    "radial-gradient(164.53% 66.45% at 0% 100%, rgba(87, 224, 245, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), rgba(24, 24, 27, 0.50)"
  );
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w="100%"
        h="100vh"
        bg={cardBgColor}
        borderRadius="md"
        boxShadow="lg"
        overflow="hidden"
        position="relative"
      >
        {/* Header */}
        {/* <Box zIndex={1}>
          <AppHeader
            expanded={false}
            showMenu={true} // Set to false if you don't want the menu
            bgColor={bgColor}
            headerBgColor={headerBgColor}
            headerTextColor={headerTextColor}
            menuTextColor={menuTextColor}
            onExpandToggle={() => {
              if (window.ipc) {
                window.ipc.minimizeExpandedApp();
                setIsExpanded(false);
                // router.push("/");
              }
            }}
            onSettingsClick={() => {
              if (window.ipc) {
                window.ipc.openSettingsWindow();
              }
            }}
            onQuitClick={() => {
              if (window.ipc) {
                window.ipc.quitApp();
              }
            }}
          />
        </Box> */}

        {/* Main Content */}
        <motion.div variants={childVariants}>
          <Grid
            templateColumns={"400px 1fr"}
            templateRows="repeat(1, 1fr)"
            gap={0}
            h="100vh"
            overflow={"hidden"}
            backgroundImage="radial-gradient(#2f4e5054 0.8px, transparent 0)"
            backgroundSize="12px 12px"
          >
            <GridItem
              colSpan={1}
              rowSpan={1}
              h="100vh"
              overflow="hidden"
            >
              <ConnectionSidebar />
            </GridItem>

            <GridItem
              colSpan={1}
              rowSpan={1}
              overflow="hidden"
              bg="#0D0F12"
            >
              <Tabs
                index={activeTab}
                onChange={setActiveTab}
                variant="unstyled"
                h="100%"
                display="flex"
                flexDirection="column"
              >
                <TabList
                  h="54px"
                  flexShrink={0}
                  px={5}
                  alignItems="flex-end"
                  gap={8}
                  borderBottom="1px solid rgba(255,255,255,0.08)"
                  bg="#111316"
                >
                  <Tab
                    h="54px"
                    px={1}
                    color="gray.500"
                    fontSize="13px"
                    fontWeight="500"
                    borderBottom="2px solid transparent"
                    _selected={{
                      color: "white",
                      borderBottomColor: "#27D7F2",
                    }}
                    _hover={{
                      color: "gray.200",
                    }}
                  >
                    Overview
                  </Tab>

                  <Tab
                    h="54px"
                    px={1}
                    color="gray.500"
                    fontSize="13px"
                    fontWeight="500"
                    borderBottom="2px solid transparent"
                    _selected={{
                      color: "white",
                      borderBottomColor: "#27D7F2",
                    }}
                    _hover={{
                      color: "gray.200",
                    }}
                  >
                    Rules
                  </Tab>

                  <Tab
                    h="54px"
                    px={1}
                    color="gray.500"
                    fontSize="13px"
                    fontWeight="500"
                    borderBottom="2px solid transparent"
                    _selected={{
                      color: "white",
                      borderBottomColor: "#27D7F2",
                    }}
                    _hover={{
                      color: "gray.200",
                    }}
                  >
                    Activity
                  </Tab>
                </TabList>

                <TabPanels flex="1" minH={0}>
                  <TabPanel p={0} h="100%">
                    {showAnimations ? (
                      <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        h="100%"
                        w="100%"
                        overflow="hidden"
                        bg="black"
                      >
                        <Box
                          position="absolute"
                          h={screenSize.height}
                          w={screenSize.width * 0.8}
                          overflow="hidden"
                          border="1px solid rgba(22, 81, 103, 0.8)"
                        >
                          <GlobeComponent
                            realLocation={realLocation}
                            proxyLocation={proxyLocation}
                            relayLocation={relayLocation}
                            rotating={false}
                            enableOrbitControls={true}
                            initialZoom={5}
                            circuitHopCountries={circuitHopCountries}
                            circuitHopCoordinates={circuitHopCoordinates}
                          />
                        </Box>
                      </Flex>
                    ) : (
                      <Box
                        h="100%"
                        w="100%"
                        bg="rgba(10, 16, 18, 0.95)"
                        border="1px solid rgba(22, 81, 103, 0.4)"
                        overflow="hidden"
                      >
                        <CircuitPathView />
                      </Box>
                    )}
                  </TabPanel>

                  <TabPanel p={0} h="100%">
                    <RulesPanel headerBgColor={ipcCardText} />
                  </TabPanel>

                  <TabPanel p={0} h="100%">
                    <ActivityPanel />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>

          </Grid>
        </motion.div>
      </Box>
    </Box>
  );
}

export default ExpandedHomePage;
