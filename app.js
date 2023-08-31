const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/text2image', async (req, res) => {
  const {
    token,
    model = 'prompthero/openjourney-v4',
    prompt,
    cache = true,
  } = req.body

  if (!token || !prompt) {
    return res.status(400).send('Missing required parameters: token or prompt')
  }

  const inputData = {
    inputs: prompt,
    options: {
      wait_for_model: true,
      use_cache: cache,
    },
  }

  try {
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

    res.json({ buffer: img })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error generating the image: ${error.message}`)
  }
})

// Start the server
const port = 3909
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
