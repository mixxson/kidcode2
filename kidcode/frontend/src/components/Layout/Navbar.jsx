import React, { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { 
  Box, 
  Flex, 
  HStack, 
  Button, 
  Text,
  IconButton,
  Menu,
  Portal,
  Link
} from '@chakra-ui/react'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@chakra-ui/react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kidcode_user')
      if (raw) {
        setUser(JSON.parse(raw))
      }
    } catch(e) {
      console.error('Error loading user:', e)
    }
  }, [location]) // Reload user on route change

  function logout() {
    localStorage.removeItem('kidcode_token')
    localStorage.removeItem('kidcode_user')
    setUser(null)
    navigate('/')
    window.location.reload()
  }

  const isActive = (path) => location.pathname === path

  return (
    <Box 
      as="nav" 
      bg="white" 
      borderBottom="1px" 
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="1000"
      boxShadow="sm"
    >
      <Flex 
        maxW="1400px" 
        mx="auto" 
        px={{ base: 4, md: 6 }} 
        py={3} 
        align="center" 
        justify="space-between"
      >
        {/* Logo */}
        <Link asChild _hover={{ textDecoration: 'none' }} flexShrink={0}>
          <RouterLink to="/">
            <HStack gap={2}>
              <Text 
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="bold" 
                bgGradient="to-r" 
                gradientFrom="blue.500" 
                gradientTo="purple.500"
                bgClip="text"
              >
                👨‍💻 KidCode
              </Text>
            </HStack>
          </RouterLink>
        </Link>

        {/* Desktop Navigation */}
        <HStack gap={1} display={{ base: 'none', lg: 'flex' }} flex={1} justify="center">
          {user && (user.role === 'teacher' || user.isAdmin) && (
            <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
              📊 Dashboard
            </NavLink>
          )}
          
          {user && (
            <NavLink to="/lessons" isActive={isActive('/lessons')}>
              📚 Lekcje
            </NavLink>
          )}
          
          {user && (
            <NavLink to="/rooms" isActive={isActive('/rooms')}>
              🚪 Pokoje
            </NavLink>
          )}

          {user?.isAdmin && (
            <NavLink to="/admin" isActive={isActive('/admin')}>
              ⚙️ Admin
            </NavLink>
          )}
        </HStack>

        {/* User Menu / Auth Buttons */}
        <HStack gap={2} display={{ base: 'none', lg: 'flex' }} flexShrink={0}>
          {!user ? (
            <>
              <Button 
                asChild
                variant="ghost" 
                size="sm"
                colorPalette="blue"
              >
                <RouterLink to="/login">Zaloguj</RouterLink>
              </Button>
              <Button 
                asChild
                variant="solid" 
                size="sm"
                colorPalette="blue"
              >
                <RouterLink to="/register">Rejestracja</RouterLink>
              </Button>
            </>
          ) : (
            <HStack gap={2}>
              <Box 
                px={2}
                py={1.5}
                bg="gray.50"
                borderRadius="md"
                fontSize="sm"
                borderWidth="1px"
                borderColor="gray.200"
                minW="100px"
              >
                <Text fontWeight="medium" fontSize="xs" color="gray.600" noOfLines={1}>
                  {user.isAdmin || user.role === 'admin' ? '👑 Admin' : 
                   user.role === 'teacher' ? '👨‍🏫 Nauczyciel' : 
                   '👨‍🎓 Uczeń'}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={0.5} noOfLines={1}>
                  {user.email?.split('@')[0] || 'User'}
                </Text>
              </Box>
              <Button 
                variant="outline" 
                size="sm"
                colorPalette="red"
                onClick={logout}
                flexShrink={0}
              >
                🚪 Wyloguj
              </Button>
            </HStack>
          )}
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton 
          display={{ base: 'flex', lg: 'none' }}
          variant="ghost"
          aria-label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          size="sm"
          flexShrink={0}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </IconButton>
      </Flex>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box 
          display={{ base: 'block', lg: 'none' }}
          pb={4}
          px={4}
          borderTop="1px"
          borderColor="gray.200"
          bg="gray.50"
        >
          <Flex direction="column" gap={2} mt={2}>
            {user && (user.role === 'teacher' || user.isAdmin) && (
              <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                📊 Dashboard
              </MobileNavLink>
            )}
            
            {user && (
              <MobileNavLink to="/lessons" onClick={() => setMobileMenuOpen(false)}>
                📚 Lekcje
              </MobileNavLink>
            )}
            
            {user && (
              <MobileNavLink to="/rooms" onClick={() => setMobileMenuOpen(false)}>
                🚪 Pokoje
              </MobileNavLink>
            )}

            {user?.isAdmin && (
              <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                ⚙️ Admin
              </MobileNavLink>
            )}

            {!user ? (
              <>
                <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  Zaloguj
                </MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                  Rejestracja
                </MobileNavLink>
              </>
            ) : (
              <>
                <Box py={2} px={3} bg="white" borderRadius="md" fontSize="sm" color="gray.600">
                  <Text fontWeight="medium">👤 {user.email}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {user.isAdmin || user.role === 'admin' ? '👑 Admin' : 
                     user.role === 'teacher' ? '👨‍🏫 Nauczyciel' : 
                     '👨‍🎓 Uczeń'}
                  </Text>
                </Box>
                <Button 
                  size="sm" 
                  colorPalette="red" 
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                >
                  🚪 Wyloguj
                </Button>
              </>
            )}
          </Flex>
        </Box>
      )}
    </Box>
  )
}

// Desktop Nav Link Component
function NavLink({ to, isActive, children }) {
  return (
    <Button
      asChild
      variant={isActive ? 'solid' : 'ghost'}
      colorPalette={isActive ? 'blue' : 'gray'}
      size="sm"
      fontWeight="medium"
    >
      <RouterLink to={to}>{children}</RouterLink>
    </Button>
  )
}

// Mobile Nav Link Component
function MobileNavLink({ to, onClick, children }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      width="full"
      justifyContent="flex-start"
      onClick={onClick}
    >
      <RouterLink to={to}>{children}</RouterLink>
    </Button>
  )
}
