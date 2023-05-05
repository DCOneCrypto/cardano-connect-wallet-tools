//tsrpfc
import { LayoutProps } from "@/models";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import { useWallet } from "@meshsdk/react";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import Button from "@mui/material/Button";
import Logout from '@mui/icons-material/Logout';
import ImageIcon from '@mui/icons-material/Image';
import { Icon } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import { useAuth } from "@/hooks";
import useMediaQuery from '@mui/material/useMediaQuery';
import { ModalWallet } from "../common/list-wallet";
import { Auth } from "../common";
import { useRouter } from "next/router";

const drawerWidth = 240;

export function MainLayout({ children, window }: LayoutProps) {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { connected, wallet, error, connect, disconnect } = useWallet();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [balance, setBalance] = React.useState<number>(0);
  const matches = useMediaQuery((theme: any) => theme.breakpoints.up('sm'));
  const { name, logout } = useAuth();
  const router = useRouter()
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    getWallet();
  };

  React.useEffect(() => {
    getWallet();
  }, [wallet, name]);

  const getWallet = async () => {
    if (wallet && connected) {
      const ada = await wallet.getBalance()
      const ares = await wallet.getRewardAddresses();
      const result = ada.find((obj: any) => {
        return obj.unit === "lovelace";
      });
      if (result) {
        setBalance(result.quantity / 1000000)
      }
    } else if (name) {
      console.log("name------------", name)
      connect(name)
    }
  }
  const handleLogout = (
  ) => {
    logout();
    console.log("handLogout-----")
    disconnect();
    setBalance(0);
    
    router.push("/");
  };

  const listMenu = [
    {
      name: "Chuyển Token", link: "/send-token", icon: ArrowForwardIcon
    },
    {
      name: "NFTs", link: "", icon: ImageIcon
    },
    {
      name: "Lock", link: "", icon: ImageIcon
    }
  ]
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {listMenu.map((obj, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={obj.link}>
              <ListItemIcon>
                <Icon component={obj.icon}></Icon>
              </ListItemIcon>
              <ListItemText primary={obj.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Auth>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          color="transparent"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              <Link href="/">
                UpdateGroupTools
              </Link>
            </Typography>
            {matches &&
              <Stack direction="row" spacing={1}>
                {
                  connected ? (
                    <React.Fragment>
                      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                        <Tooltip title="Account settings">
                          <Stack spacing={2} direction="row" alignItems="center">
                            <Stack>
                              <IconButton
                                onClick={handleClickMenu}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={openMenu ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openMenu ? 'true' : undefined}
                              >
                                <Avatar sx={{ width: 32, height: 32 }} component={PersonIcon} />
                              </IconButton>
                            </Stack>
                            <Stack sx={{ minWidth: 0 }}>
                              <Typography noWrap>{balance.toLocaleString().split(".")[0]} ₳</Typography>
                            </Stack>
                          </Stack>
                        </Tooltip>
                      </Box>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openMenu}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={handleLogout}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Hủy kết nối
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  ) :
                    <Button variant="contained" sx={{ textTransform: "none" }} onClick={handOpen}>
                      Connect wallet
                    </Button>
                }

              </Stack>
            }
            <ModalWallet handleClose={handleClose} open={openModal} />
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Auth>
  );
}
