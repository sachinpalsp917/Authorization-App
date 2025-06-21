import ResetPasswordForm from "../components/ResetPasswordForm";
import {
  Alert,
  Container,
  Flex,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  let code = searchParams.get("code");
  const exp = code.split("?exp=");
  code = exp[0];
  const now = Date.now();
  const linkisValid = code && exp[1] && exp[1] > now;

  return (
    <Flex minH={"100vh"} justify={"center"}>
      <Container mx={"auto"} maxW={"md"} py={12} px={6} textAlign={"center"}>
        {linkisValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <VStack align={"center"} gap={6}>
            <Alert.Root status={"error"}>
              <Alert.Indicator />
              <Alert.Title>Invalid link</Alert.Title>
            </Alert.Root>
            <Text color={"gray.400"}>
              This link is either invalid or expired.
            </Text>
            <ChakraLink asChild>
              <Link to={"/password/forgot"} replace>
                Request a new password link
              </Link>
            </ChakraLink>
          </VStack>
        )}
      </Container>
    </Flex>
  );
};

export default ResetPassword;
