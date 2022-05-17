import { NextApiRequest, NextApiResponse } from "next"
import { ConvertFaceResponse, PixelMeClient } from "services/pixelme"

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { image } = req.body
  const response = await PixelMeClient.post<ConvertFaceResponse>("detect", {
    image,
  })
  res.json(response.data)
}
