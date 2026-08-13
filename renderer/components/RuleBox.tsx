import {
  Box,
  Button,
  Flex,
  HStack,
  Switch,
  Text,
} from "@chakra-ui/react";
import FlagIcon from "./FlagIcon";

export interface Rule {
  id: string;
  title: string;
  destinations: string[];
  hops: number;
  entryCountries: string[];
  exitCountries: string[];
  enabled?: boolean;
}

interface RuleBoxProps {
  rule: Rule;
  headerBgColor: string;
  deleteProxyRule: (ruleId: string) => void;
  editProxyRule: (rule: Rule) => void;
  toggleProxyRule: (ruleId: string) => void;
  proxyRunning: boolean;
}

export const RuleBox: React.FC<RuleBoxProps> = ({
  rule,
  headerBgColor,
  deleteProxyRule,
  editProxyRule,
  toggleProxyRule,
  proxyRunning,
}) => {
  const isEnabled = rule.enabled !== false;

  const destinationSummary =
    rule.destinations.length > 2
      ? `${rule.destinations.slice(0, 2).join(", ")}, +${
          rule.destinations.length - 2
        } more`
      : rule.destinations.join(", ");

  return (
    <Box
      w="100%"
      border="1px solid"
      borderColor={
        isEnabled
          ? "rgba(255,255,255,0.14)"
          : "rgba(255,255,255,0.07)"
      }
      borderRadius="8px"
      bg="rgba(255,255,255,0.018)"
      px={4}
      py={3}
      opacity={isEnabled ? 1 : 0.5}
      transition="background 0.15s ease, border-color 0.15s ease"
      _hover={{
        bg: "rgba(255,255,255,0.028)",
        borderColor: "rgba(255,255,255,0.20)",
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={4}
        minH="48px"
      >
        <Flex
          align="center"
          gap={3}
          minW={0}
          flex="1"
        >
          <Switch
            size="sm"
            isChecked={isEnabled}
            onChange={() => toggleProxyRule(rule.id)}
            colorScheme="green"
          />

          <Box minW={0}>
            <Text
              color={isEnabled ? headerBgColor : "gray.500"}
              fontWeight="500"
              fontSize="14px"
              noOfLines={1}
            >
              {rule.title}
            </Text>

            <Text
              mt="2px"
              fontSize="11px"
              color="gray.500"
              noOfLines={1}
            >
              {destinationSummary || "No destinations"}
            </Text>
          </Box>
        </Flex>

        <HStack spacing={2} flexShrink={0}>
          <Box
            px={3}
            py="5px"
            borderRadius="6px"
            border="1px solid rgba(255,255,255,0.08)"
            bg="rgba(255,255,255,0.02)"
          >
            <Text
              color="gray.400"
              fontSize="11px"
              whiteSpace="nowrap"
            >
              {rule.hops} {rule.hops === 1 ? "hop" : "hops"}
            </Text>
          </Box>

          {rule.exitCountries.map((country) => (
            <Flex
              key={country}
              align="center"
              gap={1}
              px={3}
              py="5px"
              borderRadius="6px"
              border="1px solid rgba(255,255,255,0.08)"
              bg="rgba(255,255,255,0.02)"
            >
              <FlagIcon code={country} width={16} />

              <Text
                color="gray.300"
                fontSize="11px"
                whiteSpace="nowrap"
              >
                {country.toUpperCase()}
              </Text>
            </Flex>
          ))}

          <Button
            size="sm"
            variant="ghost"
            color="gray.400"
            fontSize="12px"
            fontWeight="400"
            onClick={() => editProxyRule(rule)}
            isDisabled={proxyRunning}
            _hover={{
              color: "white",
              bg: "rgba(255,255,255,0.05)",
            }}
            _disabled={{
              opacity: 0.35,
              cursor: "not-allowed",
            }}
          >
            Edit
          </Button>

          <Button
            size="sm"
            variant="ghost"
            color="red.300"
            fontSize="12px"
            fontWeight="400"
            onClick={() => deleteProxyRule(rule.id)}
            isDisabled={proxyRunning}
            _hover={{
              color: "red.200",
              bg: "rgba(255,80,80,0.06)",
            }}
            _disabled={{
              opacity: 0.35,
              cursor: "not-allowed",
            }}
          >
            Delete
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
