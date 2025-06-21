import {
  Alert,
  Box,
  Heading,
  Stack,
  Link as ChakraLink,
  Field,
  Button,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PasswordInput } from "../components/ui/password-input";
import { resetPassword } from "../lib/apiCalls";

const ResetPasswordForm = ({ code }) => {
  const [password, setPassword] = useState("");
  const {
    mutate: resetUserPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: resetPassword,
  });
  return (
    <>
      <Heading fontSize={"4xl"} mb={8}>
        Change your Password
      </Heading>
      <Box rounded={"lg"} bg={"gray.700"} boxShadow={"lg"} p={8}>
        {isError && (
          <Box mb={3} color={"red.400"}>
            {error.message || "An error occured "}
          </Box>
        )}
        {isSuccess ? (
          <Box>
            <Alert.Root status="info" title="Password Updated Successfully">
              <Alert.Indicator />
              <Alert.Title>Password Updated Successfully</Alert.Title>
            </Alert.Root>
            <ChakraLink asChild>
              <Link to={"/login"} replace>
                Sign in
              </Link>
            </ChakraLink>
          </Box>
        ) : (
          <Stack gap={4}>
            <form>
              <Field.Root id="password">
                <Field.Label>New Password</Field.Label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    resetUserPassword({ password, verificationCode: code })
                  }
                  autoFocus
                />
              </Field.Root>
              <Button
                my={2}
                isLoading={isPending}
                isDisabled={password.length < 6}
                onClick={() =>
                  resetUserPassword({
                    password,
                    verificationCode: code,
                  })
                }
              >
                Reset Password
              </Button>
            </form>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default ResetPasswordForm;
