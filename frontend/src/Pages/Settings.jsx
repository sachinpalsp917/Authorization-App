import SessionCard from "../components/SessionCard";
import useSessions from "../hooks/useSessions";
import { Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import React from "react";

const Settings = () => {
  const { sessions, isSuccess, isPending, isError } = useSessions();
  return (
    <Container mt={16}>
      <Heading mb={6} fontSize={"4xl"} textAlign={"center"} size={"md"}>
        My Sessions
      </Heading>
      {isPending && <Spinner />}
      {isError && <Text color={"red.400 "}>Failed to get Sessions.</Text>}
      {isSuccess && (
        <VStack gap={3} align={"flex-start "}>
          {sessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Settings;
