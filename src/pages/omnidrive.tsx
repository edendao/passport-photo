/* eslint-disable no-debugger */
import { Box, HStack, Image, Progress, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"

const Omnidrive: React.FC = () => {
  return (
    <VStack
      alignItems="stretch"
      spacing={3}
      p={3}
      bg="white"
      rounded="md"
      boxShadow="md"
    >
      <Box position="relative" width={256} height={256}>
        <Image
          zIndex={2}
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          id="active-frame"
          alt=""
        />
        <Image
          id="previous-frame"
          alt=""
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
        />
      </Box>
      <Progress
        isAnimated
        hasStripe={true}
        size="lg"
        value={12}
        max={100}
        colorScheme="yellow"
        rounded="sm"
      />
    </VStack>
  )
}

export default function TimeMachine() {
  const router = useRouter()
  const { path, frames } = router.query

  return (
    <HStack>
      <Omnidrive
        basePath={path as string}
        framesCount={parseInt(frames as string)}
      />
    </HStack>
  )
}
