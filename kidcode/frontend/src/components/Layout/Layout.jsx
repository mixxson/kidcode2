import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import Navbar from './Navbar'
import PageTransition from '../PageTransition'

export default function Layout({ children, maxWidth = '1400px', fullWidth = false }) {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
      <Navbar />
      
      <PageTransition>
        {fullWidth ? (
          <Box flex="1" pb={6}>{children}</Box>
        ) : (
          <Container maxW={maxWidth} py={6} pb={8} flex="1">
            {children}
          </Container>
        )}
      </PageTransition>
    </Box>
  )
}
