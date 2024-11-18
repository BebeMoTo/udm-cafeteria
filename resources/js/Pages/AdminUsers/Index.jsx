import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, TextField, Select, MenuItem, Snackbar, IconButton } from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import AdminUserCard from './AdminUsersComponents/AdminUserCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import CheckIcon from '@mui/icons-material/Check';
import UserDeleteModal from './AdminUsersComponents/UserDeleteModal';
import AdminUpdateModal from './AdminUsersComponents/AdminUpdateModal';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[50], // Set the primary color to white
    },
  },
});

const Index = ({ auth, users: initialUsers }) => {
  //console.log(initialUsers);
  const [users, setUsers] = useState(initialUsers.data); // Store user data
  const [currentPage, setCurrentPage] = useState(initialUsers.current_page); // Track the current page
  const [lastPage, setLastPage] = useState(initialUsers.last_page); // Track the last page
  const [loading, setLoading] = useState(false); // Loading indicator for lazy loading
  const [search, setSearch] = useState(''); // Search input state
  const [sort, setSort] = useState('created_at'); // Sort input state
  const [usertype, setUsertype] = useState('All'); // State for user type filter
    // Modal and Snackbar State
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Track if the modal is open
  const [selectedUser, setSelectedUser] = useState(null); // Track user selected for deletion
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity (success/error)
  // Modal state for editing user
  const [openEditModal, setOpenEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null); // Store the user data to be edited

  // Open modal and set selected user for editing
  const handleEditClick = (user) => {
    setUserToEdit(user); // Pass user data to the form
    setOpenEditModal(true); // Open the edit modal
  };

  // Close the edit modal
  const handleEditClose = () => {
    setOpenEditModal(false);
    setUserToEdit(null); // Clear the selected user
  };

  // Function to handle updating the user
  const handleUpdateUser = async (updatedUserData) => {
    try {
      // Send a PUT request to update the user in the database
      const response = await axios.put(route('users.update', userToEdit.id), updatedUserData, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (response.status === 200) {
        // Update the local users state with the new user data
        setUsers(users.map((user) => (user.id === userToEdit.id ? response.data : user)));

        // Close the edit modal and show success message
        setSnackbarMessage('User updated successfully!');
        setSnackbarSeverity('success'); 
      } else {
        setSnackbarMessage('Failed to update user. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbarMessage('Error occurred during update.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setOpenEditModal(false);
    }
  };

  // Open modal and select user to delete
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenDeleteModal(false);
    setSelectedUser(null);
  };

  // Function to delete user
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      // Make the delete request to the server
      const response = await axios.delete(route('users.destroy', selectedUser.id), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (response.status === 200) {
        // Remove the deleted user from the list
        setUsers(users.filter(user => user.id !== selectedUser.id));

        // Show success snackbar
        setSnackbarMessage('User deleted successfully!');
        setSnackbarSeverity('success');
      } else {
        // Show error snackbar if something went wrong
        setSnackbarMessage('Failed to delete user. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbarMessage('Error occurred during deletion.');
      setSnackbarSeverity('error');
    } finally {
      // Close the modal and show the snackbar
      setOpenDeleteModal(false);
      setSnackbarOpen(true);
      setSelectedUser(null);
    }
  };
    // Snackbar Close Handler
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Function to fetch more data when needed
  const loadMoreUsers = async () => {
    if (loading || currentPage >= lastPage) return; // Don't fetch if already loading or on the last page

    setLoading(true);

    try {
      // Fetch the next page using axios
      const response = await axios.get(route('users.index'), {
        params: {
          page: currentPage + 1,
          search, // Include the current search query
          sort,   // Include the current sort option
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest', // Important to set this to identify it as an AJAX request
        },
      });

      const { data, current_page, last_page } = response.data;

      setUsers((prevUsers) => [...prevUsers, ...data]); // Append new users to the list
      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to search users
  const searchUsers = async () => {
    setLoading(true);
    setCurrentPage(1);

    try {
      const response = await axios.get(route('users.index'), {
        params: {
          page: 1, // Reset to first page
          search, // Include the current search query
          sort,   // Include the current sort option
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const { data, current_page, last_page } = response.data;

      setUsers(data); // Replace users with new search result
      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when search or sort parameters change
  useEffect(() => {
    searchUsers();
  }, [search, sort]);

  // Trigger the loadMoreUsers function on scroll to bottom
  const handleScroll = () => {
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const bottom = document.documentElement.offsetHeight;
    if (scrollPosition === bottom) {
      loadMoreUsers();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup
  }, [currentPage, lastPage, loading]);

  // Screen Width Adjustments
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update the state with the new screen width
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Filter the users based on the user type before rendering
  const filteredUsers = users.filter((user) => {
    if (usertype === 'All') return true; // No filter applied
    return user.type === usertype; // Match user type
  });

  return (
    <ThemeProvider theme={theme}>
      <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Manage Accounts</h2>}
        type={auth.user.type}
        balance={auth.user.balance}
      >
        <Head title="Manage Accounts" />
        <div className="py-5 inside-layout-background" style={{minHeight: "100svh"}}>
          <div className="mx-auto px-3 sm:px-6 lg:px-8">
            <div style={{ display: "flex", gap: "16px" }}>
              <TextField
                sx={{ width: "60%", color: "black", border: "1px solid white", borderRadius: "5px" }}
                label="Search by Name or Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') searchUsers();
                }}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '1rem', color: "white" }}
              />

              {/* Sort Select */}
              <Select
                sx={{ width: "20%", color: "white", border: "1px solid white" }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '1rem' }}
              >
                <MenuItem value="created_at"><CalendarMonthIcon /> Sort by Date</MenuItem>
                <MenuItem value="name"><BadgeIcon /> Sort by Name</MenuItem>
                <MenuItem value="email"><EmailIcon /> Sort by Email</MenuItem>
              </Select>

              {/* Sort UserType */}
              <Select
                sx={{ width: "20%" }}
                value={usertype}
                onChange={(e) => setUsertype(e.target.value)} // Handle the user type selection
                fullWidth
                variant="outlined"
                style={{ marginBottom: '1rem', color: "white", border: "1px solid white" }}
              >
                <MenuItem value="All"><CheckIcon /> All</MenuItem>
                <MenuItem value="Admin"><AdminPanelSettingsIcon /> Admin</MenuItem>
                <MenuItem value="Seller"><StoreIcon /> Seller</MenuItem>
                <MenuItem value="User"><PersonIcon /> User</MenuItem>
              </Select>
            </div>

            {filteredUsers.map((user) => (
              <div key={user.id}>
                <AdminUserCard user={user} sellerStore={user.store}>
                  <div style={{display: "flex", justifyContent: "flex-end"}}>
                  <Button variant='contained' sx={{backgroundColor: "green", color: "white"}} onClick={() => handleEditClick(user)}>
                    {screenWidth <= 800 ? <EditIcon /> : "Edit Info"}
                  </Button>
                  <Button 
                    variant='contained' 
                    color='error' 
                    sx={{ marginLeft: "8px" }} 
                    onClick={() => handleDeleteClick(user)}
                  >
                    {screenWidth <= 800 ? <DeleteForeverIcon /> : "Delete"}
                  </Button>
                  </div>
                </AdminUserCard>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <CircularProgress />
              </div>
            )}

            {/* Load More Button (optional, for manual loading) */}
            {!loading && currentPage < lastPage && (
              <Button onClick={loadMoreUsers} variant="contained" fullWidth>
                Load More...
              </Button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <UserDeleteModal
          open={openDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />

        {/* Edit User Modal */}
        <AdminUpdateModal
          open={openEditModal}
          user={userToEdit}
          onClose={handleEditClose}
          onSubmit={handleUpdateUser}
        />

        {/* Snackbar for Success/Failure Messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          severity={snackbarSeverity}
        />
      </AuthenticatedLayout>
    </ThemeProvider>
  );
};

export default Index;
