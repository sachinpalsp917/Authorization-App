import { register } from "../lib/apiCalls";
import { PasswordInput } from "../components/ui/password-input";
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
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: createAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
  });
  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container mx="auto" maxW="md" py={12} px={6} textAlign={"center"}>
        <Heading fontSize={"4xl"} mb={8}>
          Create your account
        </Heading>
        {isError && (
          <Alert.Root status="error" title="An error occured" my={4}>
            <Alert.Indicator />
            <Alert.Title>{error?.message || "An error occured"}</Alert.Title>
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
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Confirm Password</Field.Label>
                  <PasswordInput
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      createAccount({ email, password, confirmPassword })
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
                  disabled={
                    !email ||
                    password.length < 6 ||
                    password !== confirmPassword
                  }
                  onClick={() =>
                    createAccount({ email, password, confirmPassword })
                  }
                >
                  Sign in
                </Button>
                <Text alignItems={"center"} fontSize={"sm"} color={"fg.muted"}>
                  Already have an account?{" "}
                  <ChakraLink asChild colorPalette={"blue"}>
                    <Link to={"/login"}>log in</Link>
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

export default Register;
