const express = require('express')
const axios = require('axios')
const app = express()
const fs = require('fs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set up the endpoint for the POST request
app.post('/text2image', async (req, res) => {
  console.log('text2image')
  // Get the input and cache parameters from the request body
  //const { input, cache, model, token } = req.body
  const { token } = req.body

  const inputData = {
    inputs:
      'a woman wearing a poncho oversized puffer jacket, inspired by OffWhite, tumblr, inspired by Yanjun Cheng style, digital art, lofi girl internet meme, trending on dezeen, catalog photo, 3 d render beeple, rhads and lois van baarle, cartoon style illustration, bright pastel colors, a beautiful artwork illustration, retro anime girl <lora:iu_V35:0.5> <lora:epiNoiseoffset_v2:0.5>',
    options: {
      wait_for_model: true,
    },
  }
  const model = 'prompthero/openjourney-v4'

  const response = await axios({
    url: `https://api-inference.huggingface.co/models/${model}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(inputData),
    responseType: 'arraybuffer',
  })

  const mimeType = response.headers['content-type']

  const result = response.data

  const base64data = Buffer.from(result).toString('base64')

  const img = `data:${mimeType};base64,${base64data}`
  console.log(img)
  //res.json({ buffer: img })
  res.send({ base64data })
})

// Start the server
const port = 3909
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
