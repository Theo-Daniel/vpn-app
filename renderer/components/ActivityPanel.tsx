import React, { useMemo } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useAppContext } from "../context/AppProvider";

const ActivityPanel: React.FC = () => {
  const { groupedProcesses, proxyRunning } = useAppContext();

  const processes = useMemo(() => {
    return groupedProcesses.map((proc) => {
      const seen = new Set<string>();
      const pids: number[] = [];
      const remoteAddresses: string[] = [];
      const remotePorts: number[] = [];

      proc.pids.forEach((pid, index) => {
        const address = proc.remoteAddresses[index];
        const port = proc.remotePorts[index];
        const key = `${pid}-${address}-${port}`;

        if (!seen.has(key)) {
          seen.add(key);
          pids.push(pid);
          remoteAddresses.push(address);
          remotePorts.push(port);
        }
      });

      return {
        ...proc,
        pids,
        remoteAddresses,
        remotePorts,
        count: pids.length,
      };
    });
  }, [groupedProcesses]);

  return (
    <Box
      w="100%"
      h="100%"
      overflowY="auto"
      px={6}
      py={5}
      bg="#111214"
      css={{
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(39,215,242,0.22)",
          borderRadius: "4px",
        },
      }}
    >
      <Box mb={5}>
        <Text color="white" fontSize="18px" fontWeight="600">
          Activity
        </Text>

        <Text color="gray.500" fontSize="12px" mt={1}>
          Applications currently connecting through the proxy.
        </Text>
      </Box>

      {!proxyRunning ? (
        <Flex
          minH="220px"
          border="1px dashed rgba(255,255,255,0.10)"
          borderRadius="8px"
          align="center"
          justify="center"
          direction="column"
          gap={2}
        >
          <Text color="gray.400" fontSize="13px">
            Proxy is disconnected
          </Text>

          <Text color="gray.600" fontSize="11px">
            Activity will appear here after you connect.
          </Text>
        </Flex>
      ) : processes.length === 0 ? (
        <Flex
          minH="220px"
          border="1px dashed rgba(255,255,255,0.10)"
          borderRadius="8px"
          align="center"
          justify="center"
          direction="column"
          gap={2}
        >
          <Text color="gray.400" fontSize="13px">
            No active connections yet
          </Text>

          <Text color="gray.600" fontSize="11px">
            Use an application through the proxy to see activity.
          </Text>
        </Flex>
      ) : (
        <Accordion allowMultiple>
          {processes.map((proc, index) => (
            <AccordionItem
              key={`${proc.processName}-${index}`}
              border="1px solid rgba(255,255,255,0.09)"
              borderRadius="8px"
              bg="rgba(255,255,255,0.018)"
              mb={3}
              overflow="hidden"
            >
              <AccordionButton
                px={4}
                py={4}
                _hover={{
                  bg: "rgba(255,255,255,0.025)",
                }}
              >
                <Flex align="center" gap={3} flex="1" minW={0}>
                  <Avatar
                    size="sm"
                    name={proc.friendlyName}
                    src={proc.iconPath || undefined}
                    bg="rgba(255,255,255,0.06)"
                  />

                  <Box textAlign="left" minW={0}>
                    <Text
                      color="gray.200"
                      fontSize="13px"
                      fontWeight="500"
                      noOfLines={1}
                    >
                      {proc.friendlyName}
                    </Text>

                    <Text color="gray.600" fontSize="10px">
                      {proc.count} active{" "}
                      {proc.count === 1 ? "connection" : "connections"}
                    </Text>
                  </Box>
                </Flex>

                <AccordionIcon color="gray.500" />
              </AccordionButton>

              <AccordionPanel
                px={4}
                pt={0}
                pb={4}
                borderTop="1px solid rgba(255,255,255,0.05)"
              >
                {proc.pids.map((pid, connectionIndex) => (
                  <Flex
                    key={`${pid}-${connectionIndex}`}
                    py={3}
                    gap={5}
                    borderBottom={
                      connectionIndex < proc.pids.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none"
                    }
                  >
                    <Box w="90px" flexShrink={0}>
                      <Text fontSize="10px" color="gray.600">
                        PID
                      </Text>
                      <Text fontSize="11px" color="gray.300" mt={1}>
                        {pid}
                      </Text>
                    </Box>

                    <Box flex="1" minW={0}>
                      <Text fontSize="10px" color="gray.600">
                        Remote address
                      </Text>
                      <Text
                        fontSize="11px"
                        color="gray.300"
                        mt={1}
                        fontFamily="mono"
                        noOfLines={1}
                      >
                        {proc.remoteAddresses[connectionIndex] || "—"}
                      </Text>
                    </Box>

                    <Box w="80px" flexShrink={0}>
                      <Text fontSize="10px" color="gray.600">
                        Port
                      </Text>
                      <Text fontSize="11px" color="gray.300" mt={1}>
                        {proc.remotePorts[connectionIndex] || "—"}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Box>
  );
};

export default ActivityPanel;
