import { Box, HStack, IconButton, VStack } from "@chakra-ui/react"
import { useBoolean } from "ahooks"
import React, { useCallback, useRef, useState } from "react"
import { RiCameraLine, RiSkipBackFill, RiVideoUploadFill } from "react-icons/ri"
import { Image, Layer, Stage } from "react-konva"
import Webcam from "react-webcam"
import { convertFace, detectFace } from "services/pixelme"
import useCanvasImage from "use-image"

export const PhotoBooth: React.FC<{ size: number }> = ({ size = 256 }) => {
  const [image, setImage] = useState("")
  const { ref, capture, setCameraError, setCameraOnline } = useCamera(setImage)

  const [canvasClouds] = useCanvasImage("/assets/eden-dao-orb.png")
  const [canvasImage] = useCanvasImage(image)

  const [omnidriveState, setOmnidriveState] = useState<
    "ready" | "detecting" | "converting" | "complete"
  >("ready")

  // const router = useRouter()
  const initiateOmnidrive = useCallback(async () => {
    setOmnidriveState("detecting")
    const header = "data:image/gif;base64,"

    const {
      data: { image: croppedFace },
    } = await detectFace(image.slice(header.length))
    setImage(`${header}${croppedFace}`)
    setOmnidriveState("converting")

    const {
      data: {
        images: [, , { image: pixelFace }],
      },
    } = await convertFace(croppedFace)
    setImage(`${header}${pixelFace}`)
    setOmnidriveState("complete")
  }, [image])

  return (
    <VStack
      alignItems="stretch"
      spacing={3}
      p={3}
      bg="white"
      rounded="md"
      boxShadow="md"
    >
      <Box w={size} h={size} rounded="lg" overflow="hidden">
        {image && (
          <Stage width={size} height={size}>
            <Layer
              imageSmoothingEnabled={false}
              clipFunc={(ctx) => {
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false)
              }}
            >
              <Image
                image={canvasClouds}
                alt="dream"
                height={size}
                width={size}
              />
              <Image
                image={canvasImage}
                alt="face"
                opacity={omnidriveState === "complete" ? 0.9 : 0.7}
                width={omnidriveState === "complete" ? size * 0.9 : size}
                height={omnidriveState === "complete" ? size * 0.9 : size}
                x={omnidriveState === "complete" ? size * 0.05 : 0}
                y={omnidriveState === "complete" ? size * 0.1 : 0}
              />
            </Layer>
          </Stage>
        )}
        <Box pos="relative" float="left">
          <Webcam
            style={{ display: image ? "none" : "block" }}
            mirrored
            height={size}
            width={size}
            videoConstraints={{
              facingMode: "user",
              width: size,
              height: size,
            }}
            ref={ref}
            screenshotQuality={1}
            screenshotFormat="image/png"
            onUserMedia={setCameraOnline}
            onUserMediaError={setCameraError}
          />
        </Box>
      </Box>
      {image ? (
        <HStack>
          <IconButton
            p={4}
            size="xl"
            rounded="lg"
            fontSize="2rem"
            variant="outline"
            colorScheme="turqoise"
            onClick={() => {
              setOmnidriveState("ready")
              setImage("")
            }}
            aria-label="Retake photo"
            icon={<RiSkipBackFill />}
          />
          <IconButton
            p={4}
            flex={1}
            size="xl"
            icon={<RiVideoUploadFill />}
            colorScheme="green"
            color="white"
            rounded="lg"
            fontSize="2rem"
            aria-label="Sing!"
            onClick={initiateOmnidrive}
          />
        </HStack>
      ) : (
        <IconButton
          flex={1}
          p={4}
          size="xl"
          color="white"
          colorScheme="blue"
          variant="solid"
          rounded="lg"
          fontSize="2rem"
          onClick={capture}
          aria-label="Take photo"
          icon={<RiCameraLine />}
        />
      )}
    </VStack>
  )
}
const useCamera = (setImage: {
  (value: React.SetStateAction<string>): void
  (arg0: string): void
}) => {
  const [isCameraOnline, { setTrue: setCameraOnline }] = useBoolean(false)
  const [isCameraError, { setTrue: setCameraError }] = useBoolean(false)

  const ref = useRef<Webcam>(null)
  const capture = useCallback(() => {
    setImage(ref.current?.getScreenshot() ?? "")
  }, [ref, setImage])

  return {
    ref,
    capture,
    isCameraError,
    isCameraOnline,
    setCameraOnline,
    setCameraError,
  }
}
