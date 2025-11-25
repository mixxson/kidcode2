import React from 'react'
import { Box, Heading, Text, VStack, Code } from '@chakra-ui/react'

export default function OutputPanel({ output, error }){
  return (
    <Box h="100%" bg="gray.50" borderLeft="1px" borderColor="gray.200" overflowY="auto">
      <Box p={3} borderBottom="1px" borderColor="gray.200" bg="gray.100">
        <Heading size="sm">Output</Heading>
      </Box>
      <VStack align="stretch" p={3} gap={2}>
        {error && (
          <Box p={3} bg="red.50" borderLeft="3px solid" borderColor="red.500" borderRadius="md">
            <Text fontSize="sm" fontWeight="bold" color="red.700">Error:</Text>
            <Code display="block" whiteSpace="pre-wrap" bg="red.100" p={2} mt={1} borderRadius="md" color="red.800">
              {error}
            </Code>
          </Box>
        )}
        {output && output.length > 0 && (
          <Box>
            {output.map((line, i) => (
              <Text key={i} fontSize="sm" fontFamily="mono" whiteSpace="pre-wrap">
                {line}
              </Text>
            ))}
          </Box>
        )}
        {!error && (!output || output.length === 0) && (
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            Naciśnij "Uruchom" aby zobaczyć wynik...
          </Text>
        )}
      </VStack>
    </Box>
  )
}
