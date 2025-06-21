import { logout } from "../lib/apiCalls";
import queryClient from "../config/queryClient";
import { Avatar, Box, Button, Menu, Portal } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const navigate = useNavigate();
  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
  return (
    <Box style={{ position: "absolute", bottom: 20, left: 15 }}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant={"plain"} border={"black"}>
            <Avatar.Root>
              <Avatar.Fallback />
            </Avatar.Root>
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="Home" onClick={() => navigate("/")}>
                Profile
              </Menu.Item>
              <Menu.Item value="settings" onClick={() => navigate("/settings")}>
                Settings
              </Menu.Item>
              <Menu.Item value="logout" onClick={signOut}>
                logout
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};

export default UserMenu;
