import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Circle,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Progress,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMinimize2, FiPower, FiSettings } from "react-icons/fi";
import { TbCopy, TbCopyCheck } from "react-icons/tb";
import { useAppContext } from "../context/AppProvider";
import GlobalExitCountrySelector from "./GlobalExitCountrySelector";
import { SettingsComponent } from "./SettingsComponent";
import AnyoneLogo from "./Icons/Logo";

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const ConnectionSidebar: React.FC = () => {
  const {
    appBooted,
    proxyIP,
    proxyRunning,
    isLoading,
    connectionTime,
    handleStartProxy,
    handleStopProxy,
    globalExitCountry,
    setGlobalExitCountry,
    circuitHopCountries,
    isExpanded,
    setIsExpanded,
  } = useAppContext();

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const [isCopied, setIsCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  useEffect(() => {
    if (!window.ipc) return;

    const removeProgressListener = window.ipc.onProxyProgress(
      (value: number, message: string) => {
        setProgress(value);
        setProgressMessage(message);
      }
    );

    const clearProgress = () => {
      setProgress(0);
      setProgressMessage("");
    };

    const removeStartedListener = window.ipc.onProxyStarted(clearProgress);
    const removeStoppedListener = window.ipc.onProxyStopped(clearProgress);
    const removeErrorListener = window.ipc.onProxyError(clearProgress);

    return () => {
      removeProgressListener();
      removeStartedListener();
      removeStoppedListener();
      removeErrorListener();
    };
  }, []);

  const handleCopy = () => {
    if (!proxyIP || proxyIP === "-") return;

    navigator.clipboard.writeText(proxyIP);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleCollapse = async () => {
    if (!window.ipc) return;

    try {
      await window.ipc.minimizeExpandedApp();
      setIsExpanded(false);
    } catch (error) {
      console.error("Failed to collapse window:", error);
    }
  };

  const statusLabel = !appBooted
    ? "Starting"
    : isLoading
    ? proxyRunning
      ? "Disconnecting"
      : "Connecting"
    : proxyRunning
    ? "Connected"
    : "Disconnected";

  const statusDescription = proxyRunning
    ? "Your traffic is protected"
    : "Your traffic is not protected";

  const statusColor = !appBooted
    ? "#D69E2E"
    : isLoading
    ? "#D69E2E"
    : proxyRunning
    ? "#27D7F2"
    : "#EF4444";

  const hopLabels = ["You", "Entry", "Middle", "Exit"];

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        h="100%"
        bg="#141619"
        borderRight="1px solid rgba(255,255,255,0.08)"
        px={5}
        py={5}
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.10)",
            borderRadius: "4px",
          },
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          mb={6}
          minH="34px"
        >
          <Flex align="center" gap={2}>
            <AnyoneLogo
              width={22}
              height={22}
              color="#27D7F2"
            />

            <Text
              color="white"
              fontSize="14px"
              fontWeight="600"
            >
              Anyone
            </Text>
          </Flex>

          <HStack spacing={1}>
            <IconButton
              aria-label="Settings"
              icon={<FiSettings />}
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{
                color: "white",
                bg: "rgba(255,255,255,0.06)",
              }}
              onClick={onSettingsOpen}
            />

            {isExpanded && (
              <IconButton
                aria-label="Collapse window"
                icon={<FiMinimize2 />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{
                  color: "white",
                  bg: "rgba(255,255,255,0.06)",
                }}
                onClick={handleCollapse}
              />
            )}
          </HStack>
        </Flex>

        {/* Connection status */}
        <Box
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="8px"
          bg="rgba(255,255,255,0.018)"
          px={4}
          py={4}
          mb={3}
        >
          <Text
            fontSize="10px"
            color="gray.500"
            fontWeight="600"
            letterSpacing="0.08em"
            textTransform="uppercase"
            mb={3}
          >
            Connection Status
          </Text>

          <Flex align="center" gap={3}>
            <Circle
              size="13px"
              bg={statusColor}
              boxShadow={
                proxyRunning
                  ? "0 0 8px rgba(39,215,242,0.35)"
                  : "none"
              }
            />

            <Box>
              <Text
                color="white"
                fontSize="18px"
                fontWeight="500"
                lineHeight="1.2"
              >
                {statusLabel}
              </Text>

              <Text
                mt={1}
                fontSize="11px"
                color="gray.500"
              >
                {statusDescription}
              </Text>
            </Box>

            {proxyRunning && !isLoading && (
              <Text
                ml="auto"
                color="gray.500"
                fontSize="11px"
                fontFamily="mono"
              >
                {formatTime(connectionTime)}
              </Text>
            )}
          </Flex>

          {isLoading && progress > 0 && (
            <Box mt={4}>
              <Progress
                value={progress}
                size="xs"
                borderRadius="full"
                bg="rgba(255,255,255,0.06)"
                sx={{
                  "& > div": {
                    background: "#27D7F2",
                    borderRadius: "full",
                  },
                }}
              />

              <Flex justify="space-between" mt={2}>
                <Text
                  fontSize="10px"
                  color="gray.500"
                  noOfLines={1}
                >
                  {progressMessage || "Connecting"}
                </Text>

                <Text
                  fontSize="10px"
                  color="gray.500"
                  ml={2}
                >
                  {progress}%
                </Text>
              </Flex>
            </Box>
          )}

          <Box
            borderTop="1px solid rgba(255,255,255,0.06)"
            mt={4}
            pt={3}
          >
            <Text
              fontSize="10px"
              color="gray.500"
              mb={2}
            >
              Proxy IP
            </Text>

            <Flex align="center" justify="space-between">
              <Text
                color={proxyRunning ? "gray.200" : "gray.600"}
                fontSize="13px"
                fontFamily="mono"
              >
                {proxyRunning ? proxyIP || "-" : "-"}
              </Text>

              <IconButton
                aria-label="Copy proxy IP"
                icon={isCopied ? <TbCopyCheck /> : <TbCopy />}
                size="xs"
                variant="ghost"
                color="gray.500"
                _hover={{
                  color: "white",
                  bg: "rgba(255,255,255,0.05)",
                }}
                onClick={handleCopy}
                isDisabled={!proxyRunning || !proxyIP || proxyIP === "-"}
              />
            </Flex>
          </Box>
        </Box>

        {/* Exit location */}
        <Box
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="8px"
          bg="rgba(255,255,255,0.018)"
          mb={3}
          overflow="visible"
        >
          <GlobalExitCountrySelector
            globalExitCountry={globalExitCountry}
            setGlobalExitCountry={setGlobalExitCountry}
            menuTextColor="white"
            headerBgColor="#27D7F2"
          />
        </Box>

        {/* Route */}
        <Box
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="8px"
          bg="rgba(255,255,255,0.018)"
          px={4}
          py={4}
          mb={4}
        >
          <Text
            fontSize="10px"
            color="gray.500"
            fontWeight="600"
            letterSpacing="0.08em"
            textTransform="uppercase"
            mb={4}
          >
            Route
          </Text>

          <Flex align="flex-start" w="100%">
            {hopLabels.map((label, index) => {
              const isYou = index === 0;
              const hopCountry = isYou
                ? null
                : circuitHopCountries[index - 1];

              const active =
                proxyRunning &&
                (isYou || Boolean(hopCountry));

              return (
                <React.Fragment key={label}>
                  <Flex
                    direction="column"
                    align="center"
                    flexShrink={0}
                    w="46px"
                  >
                    <Circle
                      size="15px"
                      border="2px solid"
                      borderColor={
                        active
                          ? "#27D7F2"
                          : "rgba(255,255,255,0.22)"
                      }
                      bg={
                        active
                          ? "rgba(39,215,242,0.10)"
                          : "rgba(255,255,255,0.04)"
                      }
                    />

                    <Text
                      fontSize="10px"
                      color={active ? "gray.300" : "gray.600"}
                      mt={2}
                    >
                      {label}
                    </Text>

                    {!isYou && (
                      <Text
                        fontSize="9px"
                        color="gray.600"
                        mt="2px"
                      >
                        {hopCountry || "—"}
                      </Text>
                    )}
                  </Flex>

                  {index < hopLabels.length - 1 && (
                    <Box
                      flex="1"
                      mt="7px"
                      h="1px"
                      minW="12px"
                      bg={
                        proxyRunning &&
                        circuitHopCountries[index]
                          ? "rgba(39,215,242,0.45)"
                          : "rgba(255,255,255,0.15)"
                      }
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Flex>
        </Box>

        {/* Main action */}
        <Button
          w="100%"
          h="48px"
          borderRadius="7px"
          leftIcon={<FiPower size={18} />}
          background={
            proxyRunning
              ? "rgba(255,255,255,0.07)"
              : "linear-gradient(90deg, #27D7F2 0%, #2F6BFF 100%)"
          }
          color="white"
          fontWeight="600"
          fontSize="14px"
          _hover={{
            background: proxyRunning
              ? "rgba(255,255,255,0.11)"
              : "linear-gradient(90deg, #49E0F5 0%, #4B7DFF 100%)",
          }}
          _active={{
            transform: "translateY(1px)",
          }}
          onClick={
            proxyRunning || isLoading
              ? handleStopProxy
              : handleStartProxy
          }
          isDisabled={!appBooted}
        >
          {isLoading
            ? proxyRunning
              ? "Disconnecting..."
              : "Cancel connection"
            : proxyRunning
            ? "Disconnect"
            : "Connect"}
        </Button>

      </Flex>

      <Drawer
        isOpen={isSettingsOpen}
        placement="right"
        onClose={onSettingsClose}
        size="md"
      >
        <DrawerOverlay />

        <DrawerContent
          bg="rgba(24,24,27,0.96)"
          borderLeft="1px solid rgba(255,255,255,0.08)"
        >
          <DrawerCloseButton />

          <DrawerHeader>
            Settings
          </DrawerHeader>

          <DrawerBody>
            <SettingsComponent headerBgColor="#27D7F2" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ConnectionSidebar;
