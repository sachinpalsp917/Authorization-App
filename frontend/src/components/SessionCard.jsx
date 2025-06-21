import useDeleteSession from "../hooks/useDeleteSession";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

const SessionCard = ({ session }) => {
  const { _id, createdAt, isCurrent, userAgent } = session;

  const { deleteSession, isPending } = useDeleteSession(_id);
  return (
    <Flex p={3} borderWidth="1px" borderRadius="md" w={"full"}>
      <Box flex={1} w={"fit-content"}>
        <Text fontWeight="bold" fontSize="sm" mb={1}>
          {new Date(createdAt).toLocaleString("en-US")}
          {isCurrent && " (current session)"}
        </Text>
        <Text color="gray.500" fontSize="xs">
          {userAgent}
        </Text>
      </Box>
      {!isCurrent && (
        <Button
          size="sm"
          variant="ghost"
          ml={4}
          alignSelf="center"
          fontSize="xl"
          color="red.400"
          title="Delete Session"
          onClick={deleteSession}
          isLoading={isPending}
        >
          &times;
        </Button>
      )}
    </Flex>
  );
};

export default SessionCard;
