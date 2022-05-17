/* eslint-disable no-debugger */
import {
  Box,
  Button,
  HStack,
  IconButton,
  Progress,
  VStack,
} from "@chakra-ui/react"
import { useBoolean } from "ahooks"
import Konva from "konva"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FaPassport } from "react-icons/fa"
import { GiPortal } from "react-icons/gi"
import { RiCameraLine, RiImageAddLine, RiSkipBackFill } from "react-icons/ri"
import { Image, Layer, Stage } from "react-konva"
import Webcam from "react-webcam"
import { convertFace, detectFace } from "services/pixelme"
import useCanvasImage from "use-image"

export const PhotoBooth: React.FC<{ size: number }> = ({ size = 256 }) => {
  const [image, setImage] = useState("")
  const {
    ref: webcamRef,
    capture,
    setCameraError,
    setCameraOnline,
  } = useCamera(setImage)
  const { FileInput, selectFile } = useBase64ImageFile(setImage)

  const [canvasClouds] = useCanvasImage("/assets/eden-dao-orb.png")
  const [canvasImage] = useCanvasImage(image)

  const [omnidriveState, setOmnidriveState] = useState<
    "ready" | "selected" | "detecting" | "converting" | "complete"
  >("ready")

  useEffect(() => {
    if (omnidriveState === "ready" && image.length > 0) {
      setOmnidriveState("selected")
    }
  }, [omnidriveState, image])

  const stage = useRef<Konva.Stage>(null)

  // const router = useRouter()
  const initiateOmnidrive = useCallback(async () => {
    const image = stage.current!.toDataURL()

    setOmnidriveState("detecting")
    const header = "data:image/gif;base64,"

    const {
      data: { image: croppedFace },
    } = await detectFace(image.slice(image.indexOf(",") + 1))
    setImage(`${header}${croppedFace}`)
    setOmnidriveState("converting")

    const {
      data: {
        images: [, , { image: pixelFace }],
      },
    } = await convertFace(croppedFace)
    setImage(`${header}${pixelFace}`)
    setOmnidriveState("complete")
  }, [setImage, setOmnidriveState])

  const canvasImageProps = useMemo(() => {
    if (!canvasImage) return {}

    const { naturalHeight, naturalWidth } = canvasImage

    let opacity = 0.7
    let x = 0
    let y = 0
    let height = size
    let width = (size * naturalWidth) / naturalHeight

    if (omnidriveState === "complete") {
      opacity = 1
      height *= 0.85
      width *= 0.85
      y = 0.15 * size
    }
    x = width < size ? (size - width) / 2 : 0

    return { opacity, height, width, x, y }
  }, [omnidriveState, size, canvasImage])

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
          <Stage width={size} height={size} ref={stage}>
            {omnidriveState === "selected" ? (
              <Layer imageSmoothingEnabled={false}>
                <Image image={canvasImage} alt="face" {...canvasImageProps} />
              </Layer>
            ) : (
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
                <Image image={canvasImage} alt="face" {...canvasImageProps} />
              </Layer>
            )}
          </Stage>
        )}
        <Box pos="relative" float="left">
          <Webcam
            style={{ display: image ? "none" : "block" }}
            mirrored
            height={size}
            width={size}
            videoConstraints={{ facingMode: "user", width: size, height: size }}
            ref={webcamRef}
            screenshotQuality={1}
            screenshotFormat="image/png"
            onUserMedia={setCameraOnline}
            onUserMediaError={setCameraError}
          />
        </Box>
      </Box>
      {omnidriveState === "ready" ? (
        <HStack>
          <IconButton
            flex={1}
            p={4}
            size="xl"
            colorScheme="blue"
            variant="outline"
            rounded="lg"
            fontSize="2rem"
            onClick={selectFile}
            aria-label="Upload Photo"
            icon={
              <>
                <RiImageAddLine />
                <FileInput />
              </>
            }
          />
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
            aria-label="Take Photo"
            icon={<RiCameraLine />}
          />
        </HStack>
      ) : omnidriveState === "selected" ? (
        <HStack>
          <IconButton
            p={4}
            size="xl"
            rounded="lg"
            fontSize="2rem"
            variant="outline"
            colorScheme="green"
            onClick={() => {
              setOmnidriveState("ready")
              setImage("")
            }}
            aria-label="GO BACK"
            icon={<RiSkipBackFill />}
          />
          <Button
            p={4}
            flex={1}
            size="xl"
            rightIcon={<GiPortal />}
            colorScheme="green"
            color="white"
            rounded="lg"
            fontSize="2rem"
            onClick={initiateOmnidrive}
          >
            RE-FI
          </Button>
        </HStack>
      ) : omnidriveState !== "complete" ? (
        <Progress
          hasStripe
          isAnimated
          size="lg"
          value={omnidriveState === "detecting" ? 25 : 65}
          max={100}
        />
      ) : omnidriveState === "complete" ? (
        <HStack>
          <IconButton
            p={4}
            size="xl"
            rounded="lg"
            fontSize="2rem"
            variant="outline"
            colorScheme="green"
            onClick={() => {
              setOmnidriveState("ready")
              setImage("")
            }}
            aria-label="GO BACK"
            icon={<RiSkipBackFill />}
          />
          <Button
            p={4}
            flex={1}
            size="xl"
            rightIcon={<FaPassport />}
            colorScheme="green"
            color="white"
            rounded="lg"
            fontSize="2rem"
          >
            MINT DAO PASSPORT
          </Button>
        </HStack>
      ) : null}
    </VStack>
  )
}

const useBase64ImageFile = (setImage: {
  (value: React.SetStateAction<string>): void
  (arg0: string): void
}) => {
  const ref = useRef<HTMLInputElement>(null)

  const setFile = useCallback(
    (event) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target!.result as string
        setImage(base64)
      }
      reader.readAsDataURL(event.target.files[0])
    },
    [setImage],
  )

  const FileInput = useCallback(
    () => (
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={setFile}
        style={{ display: "none" }}
      />
    ),
    [setFile],
  )

  const selectFile = useCallback(() => {
    ref.current?.click()
  }, [ref])

  return { FileInput, selectFile }
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
