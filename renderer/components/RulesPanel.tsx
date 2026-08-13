import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Switch,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { useAppContext } from "../context/AppProvider";
import { RuleBox, Rule } from "./RuleBox";
import { NewRuleBox } from "./NewRuleBox";

interface RulesPanelProps {
  headerBgColor?: string;
}

const RulesPanel: React.FC<RulesPanelProps> = ({
  headerBgColor = "#27D7F2",
}) => {
  const {
    proxyRunning,
    proxyRules,
    handleAddProxyRule,
    handleDeleteProxyRule,
    handleEditProxyRule,
    handleToggleProxyRule,
    handleToggleAllProxyRules,
  } = useAppContext();

  const {
    isOpen: isRuleModalOpen,
    onOpen: onRuleModalOpen,
    onClose: onRuleModalClose,
  } = useDisclosure();

  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    onRuleModalOpen();
  };

  const handleAddRule = (rule: Omit<Rule, "id">) => {
    handleAddProxyRule(rule);
    onRuleModalClose();
  };

  const handleUpdateRule = (rule: Rule) => {
    handleEditProxyRule(rule);
    setEditingRule(null);
    onRuleModalClose();
  };

  const handleCloseModal = () => {
    setEditingRule(null);
    onRuleModalClose();
  };

  return (
    <>
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
        <Flex
          justify="space-between"
          align="center"
          mb={5}
        >
          <Box>
            <Text
              color="white"
              fontSize="18px"
              fontWeight="600"
            >
              Routing Rules
            </Text>

            <Text
              color="gray.500"
              fontSize="12px"
              mt={1}
            >
              Control how traffic is routed through the network.
            </Text>
          </Box>

          <Button
            size="sm"
            leftIcon={<MdAdd />}
            bg="transparent"
            color={headerBgColor}
            border="1px solid"
            borderColor="rgba(39,215,242,0.35)"
            borderRadius="7px"
            _hover={{
              bg: "rgba(39,215,242,0.08)",
              borderColor: headerBgColor,
            }}
            _disabled={{
              opacity: 0.4,
              cursor: "not-allowed",
            }}
            onClick={() => {
              setEditingRule(null);
              onRuleModalOpen();
            }}
            isDisabled={proxyRunning}
          >
            Add Rule
          </Button>
        </Flex>

        {proxyRunning && (
          <Box
            mb={4}
            px={3}
            py={2}
            borderRadius="6px"
            border="1px solid rgba(255,255,255,0.06)"
            bg="rgba(255,255,255,0.025)"
          >
            <Text
              fontSize="12px"
              color="gray.500"
            >
              Rules cannot be changed while the proxy is running.
            </Text>
          </Box>
        )}

        {proxyRules.length > 0 && (
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            px={1}
          >
            <Text
              fontSize="12px"
              color="gray.500"
            >
              {proxyRules.length}{" "}
              {proxyRules.length === 1 ? "rule" : "rules"}
            </Text>

            <HStack spacing={2}>
              <Text
                fontSize="11px"
                color="gray.600"
              >
                {proxyRules.every((rule) => rule.enabled === false)
                  ? "All disabled"
                  : proxyRules.every((rule) => rule.enabled !== false)
                  ? "All enabled"
                  : "Mixed"}
              </Text>

              <Switch
                size="sm"
                colorScheme="cyan"
                isChecked={proxyRules.some(
                  (rule) => rule.enabled !== false
                )}
                onChange={(event) =>
                  handleToggleAllProxyRules(event.target.checked)
                }
              />
            </HStack>
          </Flex>
        )}

        {proxyRules.length === 0 ? (
          <Flex
            minH="220px"
            border="1px dashed rgba(255,255,255,0.10)"
            borderRadius="8px"
            align="center"
            justify="center"
            direction="column"
            gap={2}
          >
            <Text
              color="gray.400"
              fontSize="13px"
            >
              No routing rules yet
            </Text>

            <Text
              color="gray.600"
              fontSize="11px"
            >
              Add a rule to control how specific traffic is routed.
            </Text>
          </Flex>
        ) : (
          <VStack spacing={3} align="stretch">
            {proxyRules.map((rule) => (
              <RuleBox
                key={rule.id}
                rule={rule}
                headerBgColor={headerBgColor}
                deleteProxyRule={handleDeleteProxyRule}
                editProxyRule={handleEditRule}
                toggleProxyRule={handleToggleProxyRule}
                proxyRunning={proxyRunning}
              />
            ))}
          </VStack>
        )}
      </Box>

      <NewRuleBox
        isOpen={isRuleModalOpen}
        onClose={handleCloseModal}
        headerBgColor={headerBgColor}
        onAddRule={handleAddRule}
        onEditRule={handleUpdateRule}
        currentRule={editingRule ?? undefined}
      />
    </>
  );
};

export default RulesPanel;
