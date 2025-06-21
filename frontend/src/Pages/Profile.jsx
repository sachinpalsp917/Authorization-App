import { Alert, Center, Heading, Text } from "@chakra-ui/react";
import useAuth from "../hooks/useAuth";
import React from "react";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user;
  return (
    <Center my={16} flexDir={"column "}>
      <Heading mb={4} fontSize={"4xl"}>
        My Account
      </Heading>
      {!verified && (
        <Alert.Root status="warning" w={"fit-content"} borderRadius={12} mb={3}>
          <Alert.Indicator />
          <Alert.Title>Please verify your Account</Alert.Title>
        </Alert.Root>
      )}
      <Text color={"white"} mb={2}>
        Email:{" "}
        <Text as={"span"} color={"gray.400"}>
          {email}
        </Text>
      </Text>
      <Text color={"white"} mb={2}>
        Created on:{" "}
        <Text as={"span"} color={"gray.400"}>
          {new Date(createdAt).toLocaleDateString("en-US", {
            dateStyle: "medium",
          })}
        </Text>
      </Text>
    </Center>
  );
};

export default Profile;
