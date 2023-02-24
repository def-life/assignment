import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const pages = [
  { page: "Upload", to: "/" },
  { page: "Products", to: "products" },
];

function Header() {
  return (
    <AppBar position="static" sx={{mb: 2}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              ml: "auto",
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pages.map(({ page, to }) => (
              <Button
                component={Link}
                to={to}
                key={page}
                sx={{ my: 2, ml: 4, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
