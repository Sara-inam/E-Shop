import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";

const dummyUsers = [
  { name: "Muskan", email: "muskan@gmail.com", number: "1234567", date: "2025-11-25", location: "Sydney,NewYork" }
];

const UsersPage = () => {
  return (
    <Box sx={{ ml: "240px", p: 3 }}> {/* Add left margin to account for sidebar */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Registration Date</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dummyUsers.map((user, i) => (
            <TableRow key={i}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.number}</TableCell>
              <TableCell>{user.date}</TableCell>
              <TableCell>{user.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UsersPage;
