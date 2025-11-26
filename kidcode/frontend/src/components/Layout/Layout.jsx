import React from 'react'
import { Box, Container } from '@chakra-ui/react'
import Navbar from './Navbar'
import PageTransition from '../PageTransition'

export default function Layout({ children, maxWidth = '1400px', fullWidth = false }) {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      
      <PageTransition>
        {fullWidth ? (
          <Box>{children}</Box>
        ) : (
          <Container maxW={maxWidth} py={6}>
            {children}
          </Container>
        )}
      </PageTransition>
    </Box>
  )
}
