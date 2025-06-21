import { sendPasswordResetEmail } from "../lib/apiCalls";
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  Link as ChakraLink,
  Fieldset,
  Text,
  Button,
  Alert,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const {
    mutate: sendPasswordReset,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign={"center"}>
        <Heading fontSize={"4xl"} mb={8}>
          Reset your Password
        </Heading>
        {isError && (
          <Alert.Root status="error" title="An error occured" my={4}>
            <Alert.Indicator />
            <Alert.Title>{error?.message || "An error occured"}</Alert.Title>
          </Alert.Root>
        )}
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
          {isSuccess ? (
            <Alert.Root status="success" borderRadius={12}>
              <Alert.Indicator />
              <Alert.Title>
                Email sent! Check your inbox for further instructions.
              </Alert.Title>
            </Alert.Root>
          ) : (
            <form>
              <Fieldset.Root size={"lg"} maxW={"md"}>
                <Fieldset.Content>
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input
                      name="email"
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && sendPasswordReset(email)
                      }
                    />
                  </Field.Root>
                  <Button
                    variant={"solid"}
                    colorPalette={"blue"}
                    size={"md"}
                    marginTop={4}
                    mx={5}
                    loading={isPending}
                    disabled={!email}
                    onClick={() => sendPasswordReset(email)}
                  >
                    Reset Password
                  </Button>
                </Fieldset.Content>
              </Fieldset.Root>
            </form>
          )}
          <Text
            alignItems={"center"}
            fontSize={"sm"}
            color={"fg.muted"}
            marginTop={4}
          >
            Go back to{" "}
            <ChakraLink asChild colorPalette={"blue"}>
              <Link to={"/login"} replace>
                log in
              </Link>
            </ChakraLink>
            &nbsp;or&nbsp;
            <ChakraLink asChild colorPalette={"blue"}>
              <Link to={"/register"} replace>
                Sign up
              </Link>
            </ChakraLink>
          </Text>
        </Box>
      </Container>
    </Flex>
  );
};

export default ForgotPassword;
