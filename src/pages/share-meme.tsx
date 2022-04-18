import { Box, Button, HStack, Heading, Portal, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import Confetti from "react-confetti"
import {
  RiFacebookBoxFill,
  RiTwitterFill,
  RiWhatsappFill,
} from "react-icons/ri"
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share"
import { useWindowSize } from "react-use"
import { baseURL } from "services/pixelme"

export default function ShareMeme() {
  const router = useRouter()
  const adoroURL = baseURL + "/" + router.query.path + ".mp4"
  const shareURL = adoroURL

  const { width, height } = useWindowSize()

  return (
    <>
      <Portal>
        <Confetti width={width} height={height} />
      </Portal>
      <VStack>
        <VStack bg="white" rounded="xl" w="md" py={6} spacing={3}>
          <Heading>Wow!</Heading>
          <Heading fontWeight={400} fontSize="lg">
            Share your moves, you crazy animal.
          </Heading>

          <Box
            rounded="lg"
            overflow="hidden"
            position="relative"
            width={256}
            height={256}
          >
            <video
              loop
              controls={true}
              muted={false}
              width={256}
              height={256}
              src={adoroURL}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            />
          </Box>
        </VStack>

        <HStack spacing={2}>
          <Box>
            <TwitterShareButton url={shareURL}>
              <Button colorScheme="twitter">
                <RiTwitterFill style={{ marginRight: 8 }} />
                Twitter
              </Button>
            </TwitterShareButton>
          </Box>
          <Box>
            <FacebookShareButton url={shareURL}>
              <Button colorScheme="facebook">
                <RiFacebookBoxFill style={{ marginRight: 8 }} />
                Facebook
              </Button>
            </FacebookShareButton>
          </Box>
          <Box>
            <WhatsappShareButton url={shareURL}>
              <Button colorScheme="whatsapp">
                <RiWhatsappFill style={{ marginRight: 8 }} />
                WhatsApp
              </Button>
            </WhatsappShareButton>
          </Box>
        </HStack>
      </VStack>
    </>
  )
}
