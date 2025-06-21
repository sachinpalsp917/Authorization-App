import { PasswordInput } from "../components/ui/password-input";
import {
  Box,
  Container,
  Field,
  Flex,
  Heading,
  Input,
  Stack,
  Link as ChakraLink,
  Fieldset,
  Text,
  Button,
  Alert,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/apiCalls";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectUrl = location.state?.redirectUrl || "/";

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign={"center"}>
        <Heading fontSize={"4xl"} mb={8}>
          Sign into your account
        </Heading>
        {isError && (
          <Alert.Root status="error" title="Invalid Email or Password" my={4}>
            <Alert.Indicator />
            <Alert.Title>Invalid Email or Password</Alert.Title>
          </Alert.Root>
        )}
        <Box rounded="lg" bg="gray.700" boxShadow="lg" p={8}>
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
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Password</Field.Label>
                  <PasswordInput
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && signIn({ email, password })
                    }
                  />
                </Field.Root>
                <Text placeSelf={"self-end"} my={-3}>
                  {" "}
                  <ChakraLink
                    asChild
                    justifyItems={"end"}
                    colorPalette={"blue "}
                    fontSize={"sm"}
                    flex={"flex-end"}
                  >
                    <Link to={"/password/forgot"}>Forgot Password?</Link>
                  </ChakraLink>{" "}
                </Text>
                <Button
                  variant={"solid"}
                  colorPalette={"blue"}
                  size={"md"}
                  marginTop={4}
                  mx={5}
                  loading={isPending}
                  disabled={!email || password.length < 6}
                  onClick={() => signIn({ email, password })}
                >
                  Sign in
                </Button>
                <Text alignItems={"center"} fontSize={"sm"} color={"fg.muted"}>
                  Don't have an account?{" "}
                  <ChakraLink asChild colorPalette={"blue"}>
                    <Link to={"/register"}>Sign up</Link>
                  </ChakraLink>
                </Text>
              </Fieldset.Content>
            </Fieldset.Root>
          </form>
        </Box>
      </Container>
    </Flex>
  );
};

export default Login;
