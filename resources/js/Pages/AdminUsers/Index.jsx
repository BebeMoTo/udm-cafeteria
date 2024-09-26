import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, TextField, Select, MenuItem } from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import AdminUserCard from './AdminUsersComponents/AdminUserCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500], // Set the primary color to green
    },
  },
});

const Index = ({ auth, users: initialUsers }) => {
  console.log(initialUsers)
  const [users, setUsers] = useState(initialUsers.data); // Store user data
  const [currentPage, setCurrentPage] = useState(initialUsers.current_page); // Track the current page
  const [lastPage, setLastPage] = useState(initialUsers.last_page); // Track the last page
  const [loading, setLoading] = useState(false); // Loading indicator for lazy loading
  const [search, setSearch] = useState(''); // Search input state
  const [sort, setSort] = useState('created_at'); // Sort input state

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


  //Screen Width Adjustments
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

  return (
    <ThemeProvider theme={theme}>
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-thin text-xl text-gray-800 leading-tight">Manage Accounts</h2>}
      type={auth.user.type}
      balance={auth.user.balance}
    >
      <Head title="Manage Accounts" />
      <div className="py-5">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          <div style={{display: "flex", gap: "16px"}}>
            <TextField 
              sx={{width: "70%"}}
              label="Search by Name or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') searchUsers();
              }}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '1rem' }}
            />

            {/* Sort Select */}
            <Select
              sx={{width: "30%"}}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '1rem' }}
            >
              <MenuItem value="created_at">Sort by Date</MenuItem>
              <MenuItem value="name">Sort by Name</MenuItem>
              <MenuItem value="email">Sort by Email</MenuItem>
            </Select>
          </div>

          {users.map((user) => (
            <div key={user.id}>
              <AdminUserCard user = {user}>
                  <Button variant='contained' color='primary'>
                    {screenWidth <= 800 ? <EditIcon/> : "Edit Info"}
                  </Button>
                  <Button variant='contained' color='error' sx={{marginLeft: "8px"}}>
                    {screenWidth <= 800 ? <DeleteForeverIcon/> : "Delete"}
                  </Button>
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
    </AuthenticatedLayout>
    </ThemeProvider>
  );
};

export default Index;
