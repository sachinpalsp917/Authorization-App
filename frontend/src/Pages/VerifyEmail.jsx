import { verifyEmail } from "../lib/apiCalls";
import {
  Alert,
  Container,
  Flex,
  Spinner,
  Text,
  Link as ChakraLink,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { code } = useParams();
  console.log(code);
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
  });
  return (
    <Flex minH={"100vh"} justify={"center"} mt={"12"}>
      <Container mx={"auto"} maxW={"md"} py={12} px={6} textAlign={"center"}>
        {isPending ? (
          <Spinner />
        ) : (
          <VStack align={"center"} gap={6}>
            <Alert.Root
              status={isSuccess ? "success" : "error"}
              w={"fit-content"}
              borderRadius={12}
            >
              <Alert.Indicator />
              <Alert.Title>
                {isSuccess ? "Email Verified" : "Invalid link"}
              </Alert.Title>
              {isError && (
                <Text color={"gray.400"}>
                  The Link is either Invalid or expired
                  <ChakraLink asChild>
                    <Link to={"/forgot/password"} replace>
                      Get a new Link
                    </Link>
                  </ChakraLink>
                </Text>
              )}
            </Alert.Root>
            <ChakraLink asChild>
              <Link to={"/"} replace>
                Back to home
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};

export default VerifyEmail;
