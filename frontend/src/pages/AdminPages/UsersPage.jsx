import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";
import axios from "axios";

// const dummyUsers = [
//   { name: "Muskan", email: "muskan@gmail.com", number: "1234567", date: "2025-11-25", location: "Sydney,NewYork" }
// ];

const UsersPage = () => {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios.get(`${import.meta.env.VITE_DEVELOPMENT_URL}/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((response) => {
        setUsers(response.data.users)
      })
      .catch((err) => {
        console.error("User is not fetched", err);

      });
  }, []);
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
            <TableCell>Gender</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user, i) => (
            <TableRow key={i}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{user.gender}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UsersPage;
